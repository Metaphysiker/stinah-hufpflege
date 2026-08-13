<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick, inject, onMounted } from "vue";
import dicomParser from "dicom-parser";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { IDicomMetaData } from "@/interfaces/IDicomMetaData";
import { FileService } from "@/services/FileService";

const axios: any = inject("axios");
const fileService = new FileService(axios);

try {
  if (cornerstoneWADOImageLoader && cornerstoneWADOImageLoader.external) {
    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  }
} catch (err) {
  console.warn("Failed to initialize Cornerstone WADO loader externals", err);
}

const props = defineProps<{
  presignedUrl: string;
  fileKey: string;
}>();

const loading = ref(true);
const errorMessage = ref("");

// Download Progress State
const isDownloading = ref(false);
const downloadProgress = ref(0);

// DOM refs
const outerWrapper = ref<HTMLDivElement | null>(null); // whole component, used for fullscreen
const csViewport = ref<HTMLDivElement | null>(null); // element cornerstone.enable() attaches to

const arrayBufferData = ref<ArrayBuffer | null>(null);

const meta = ref<IDicomMetaData>({
  patientName: "-",
  patientId: "-",
  modality: "-",
  studyDate: "-",
  rows: 0,
  columns: 0,
  bitsAllocated: 16,
  bitsStored: 12,
  highBit: 11,
  pixelRepresentation: 0,
  photometricInterpretation: "MONOCHROME2",
  rescaleIntercept: 0,
  rescaleSlope: 1,
  windowCenter: 128,
  windowWidth: 256,
  transferSyntaxUid: "-",
});

// Interactive state
const currentFrame = ref(0);
const totalFrames = ref(1);

const windowCenter = ref(128);
const windowWidth = ref(256);
const invert = ref(false);
const zoomScale = ref(1.0); // multiplier applied on top of baseScale (the "fit to window" scale)
const baseScale = ref(1.0);
const panX = ref(0); // image-space translation (NOT raw screen pixels)
const panY = ref(0);

let csEnabled = false;
let csImageId: string | null = null;
let resizeObserver: ResizeObserver | null = null;
let resizeDebounce: ReturnType<typeof setTimeout> | null = null;

const formatDate = (rawStr: string | undefined): string => {
  if (!rawStr || rawStr.length < 8) return rawStr || "-";
  return `${rawStr.substring(0, 4)}-${rawStr.substring(4, 6)}-${rawStr.substring(6, 8)}`;
};

const loadDicomData = async () => {
  if (!props.fileKey && !props.presignedUrl) return;
  loading.value = true;
  isDownloading.value = true;
  downloadProgress.value = 0;
  errorMessage.value = "";

  try {
    let buffer: ArrayBuffer;

    try {
      // Direct download from presignedUrl to enable reliable progress tracking.
      // This is generally preferred for large files to avoid proxying through your backend.
      const response = await axios.get(props.presignedUrl, {
        responseType: "arraybuffer",
        onDownloadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            downloadProgress.value = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          } else {
            downloadProgress.value = -1; // Indeterminate if no Content-Length header is present
          }
        },
      });
      buffer = response.data;
    } catch (downloadErr) {
      console.warn(
        "Direct presigned URL download failed, falling back to proxy...",
        downloadErr
      );
      downloadProgress.value = -1; // Proxy likely won't report progress
      buffer = await fileService.downloadFileArrayBuffer(props.fileKey);
    }

    // Done downloading, now switch to parsing state
    isDownloading.value = false;
    arrayBufferData.value = buffer;

    const byteArray = new Uint8Array(buffer);
    const dataSet = dicomParser.parseDicom(byteArray);

    const getString = (tag: string) => {
      try {
        return dataSet.string(tag) || "-";
      } catch {
        return "-";
      }
    };
    const getUint16 = (tag: string, defaultVal = 0) => {
      try {
        return dataSet.uint16(tag) ?? defaultVal;
      } catch {
        return defaultVal;
      }
    };
    const getFloatString = (tag: string, defaultVal = 0) => {
      try {
        const val = dataSet.floatString(tag);
        return val !== undefined ? parseFloat(val) : defaultVal;
      } catch {
        return defaultVal;
      }
    };
    const getIntString = (tag: string, defaultVal = 1) => {
      try {
        const val = dataSet.string(tag);
        return val ? parseInt(val, 10) : defaultVal;
      } catch {
        return defaultVal;
      }
    };

    totalFrames.value = getIntString("x00280008", 1);
    currentFrame.value = 0; // Reset to first frame on new file load

    meta.value = {
      patientName: getString("x00100010"),
      patientId: getString("x00100020"),
      modality: getString("x00080060"),
      studyDate: formatDate(getString("x00080020")),
      rows: getUint16("x00280010", 512),
      columns: getUint16("x00280011", 512),
      bitsAllocated: getUint16("x00280100", 16),
      bitsStored: getUint16("x00280101", 12),
      highBit: getUint16("x00280102", 11),
      pixelRepresentation: getUint16("x00280103", 0),
      photometricInterpretation: getString("x00280004") || "MONOCHROME2",
      rescaleIntercept: getFloatString("x00281052", 0),
      rescaleSlope: getFloatString("x00281053", 1),
      windowCenter: getFloatString("x00281050", 128),
      windowWidth: getFloatString("x00281051", 256),
      transferSyntaxUid: getString("x00020010"),
    };

    windowCenter.value = meta.value.windowCenter || 128;
    windowWidth.value = meta.value.windowWidth || 256;
    if (windowWidth.value <= 0) windowWidth.value = 256;

    loading.value = false;
    await nextTick();
    await initCornerstone();
  } catch (err: any) {
    console.error("Error loading DICOM file:", err);
    errorMessage.value = `Fehler beim Laden der DICOM-Datei: ${err?.message || err}`;
    loading.value = false;
  }
};

const cleanupCornerstone = () => {
  if (csViewport.value && csEnabled) {
    try {
      cornerstone.disable(csViewport.value);
    } catch {}
    csEnabled = false;
  }
};

const waitForStableSize = (el: HTMLElement, maxFrames = 20): Promise<void> => {
  return new Promise((resolve) => {
    let lastW = -1;
    let lastH = -1;
    let stableCount = 0;
    let frame = 0;

    const check = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      frame++;

      if (w > 0 && h > 0 && w === lastW && h === lastH) {
        stableCount++;
      } else {
        stableCount = 0;
      }
      lastW = w;
      lastH = h;

      if (stableCount >= 2 || frame >= maxFrames) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    requestAnimationFrame(check);
  });
};

const syncCanvasSize = (): boolean => {
  if (!csViewport.value || !csEnabled) return false;

  let enabledElement: any;
  try {
    enabledElement = cornerstone.getEnabledElement(csViewport.value);
  } catch {
    return false;
  }
  const canvas: HTMLCanvasElement | undefined = enabledElement?.canvas;
  if (!canvas) return false;

  const rect = csViewport.value.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  if (w <= 0 || h <= 0) return false;

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  return true;
};

const displayCurrentFrame = async () => {
  if (!csViewport.value || !csEnabled || !csImageId) return;
  try {
    const frameImageId =
      totalFrames.value > 1 ? `${csImageId}?frame=${currentFrame.value}` : csImageId;

    const image = await cornerstone.loadImage(frameImageId);
    const currentViewport = cornerstone.getViewport(csViewport.value);

    if (currentViewport) {
      cornerstone.displayImage(csViewport.value, image, currentViewport);
    } else {
      cornerstone.displayImage(csViewport.value, image);
    }
  } catch (err: any) {
    console.warn("Cornerstone display error:", err);
  }
};

const initCornerstone = async () => {
  if (!arrayBufferData.value) return;
  await nextTick();
  if (!csViewport.value) return;

  try {
    cleanupCornerstone();

    await waitForStableSize(csViewport.value);
    if (!csViewport.value) return;

    cornerstone.enable(csViewport.value);
    csEnabled = true;

    const blob = new Blob([arrayBufferData.value], { type: "application/dicom" });
    csImageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);

    await displayCurrentFrame();
    fitAndReset();
  } catch (err: any) {
    console.warn("Cornerstone init error:", err);
    errorMessage.value = "Fehler beim Anzeigen des DICOM-Bilds.";
  }
};

const fitAndReset = () => {
  if (!csViewport.value || !csEnabled) return;
  try {
    if (!syncCanvasSize()) {
      requestAnimationFrame(fitAndReset);
      return;
    }

    cornerstone.fitToWindow(csViewport.value);

    const vp = cornerstone.getViewport(csViewport.value);
    if (vp && vp.scale > 0) {
      baseScale.value = vp.scale;
    }

    zoomScale.value = 1.0;
    panX.value = 0;
    panY.value = 0;

    applyViewport();
  } catch (err) {
    console.warn("Cornerstone fit error:", err);
  }
};

const applyViewport = () => {
  if (!csViewport.value || !csEnabled) return;
  try {
    const viewport = cornerstone.getViewport(csViewport.value);
    if (!viewport) return;
    viewport.voi.windowWidth = windowWidth.value;
    viewport.voi.windowCenter = windowCenter.value;
    viewport.invert = invert.value;
    viewport.scale = baseScale.value * zoomScale.value;
    viewport.translation.x = panX.value;
    viewport.translation.y = panY.value;
    cornerstone.setViewport(csViewport.value, viewport);
  } catch (err) {
    console.warn("Cornerstone update error:", err);
  }
};

watch([windowCenter, windowWidth, invert, zoomScale, panX, panY], applyViewport);

watch(currentFrame, () => {
  displayCurrentFrame();
});

watch(
  () => props.presignedUrl,
  () => {
    loadDicomData();
  },
  { immediate: true }
);

const applyPreset = (presetName: string) => {
  switch (presetName) {
    case "default":
      windowCenter.value = meta.value.windowCenter || 128;
      windowWidth.value = meta.value.windowWidth || 256;
      break;
    case "bone":
      windowCenter.value = 400;
      windowWidth.value = 1500;
      break;
    case "soft":
      windowCenter.value = 40;
      windowWidth.value = 400;
      break;
    case "contrast":
      windowCenter.value = 150;
      windowWidth.value = 600;
      break;
  }
};

const resetView = () => {
  windowCenter.value = meta.value.windowCenter || 128;
  windowWidth.value = meta.value.windowWidth || 256;
  invert.value = false;
  fitAndReset();
};

const zoomIn = () => {
  zoomScale.value = Math.min(5.0, zoomScale.value + 0.2);
};
const zoomOut = () => {
  zoomScale.value = Math.max(0.2, zoomScale.value - 0.2);
};

let isDragging = false;
let startX = 0;
let startY = 0;

const onMouseDown = (e: MouseEvent) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
};

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  startX = e.clientX;
  startY = e.clientY;

  if (e.buttons === 2 || e.shiftKey) {
    windowWidth.value = Math.max(1, windowWidth.value + dx * 2);
    windowCenter.value = windowCenter.value + dy * 2;
  } else {
    const effectiveScale = baseScale.value * zoomScale.value || 1;
    panX.value += dx / effectiveScale;
    panY.value += dy / effectiveScale;
  }
};

const onMouseUp = () => {
  isDragging = false;
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();

  if (e.shiftKey || totalFrames.value <= 1) {
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  } else {
    if (e.deltaY < 0) {
      currentFrame.value = Math.max(0, currentFrame.value - 1);
    } else {
      currentFrame.value = Math.min(totalFrames.value - 1, currentFrame.value + 1);
    }
  }
};

let touchStartDist = 0;
const onTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    touchStartDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }
};

const onTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 1 && isDragging) {
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    const effectiveScale = baseScale.value * zoomScale.value || 1;
    panX.value += dx / effectiveScale;
    panY.value += dy / effectiveScale;
  } else if (e.touches.length === 2 && touchStartDist > 0) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
    const diff = (dist - touchStartDist) * 0.005;
    zoomScale.value = Math.min(5.0, Math.max(0.2, zoomScale.value + diff));
    touchStartDist = dist;
  }
};

const onTouchEnd = () => {
  isDragging = false;
  touchStartDist = 0;
};

const toggleFullscreen = () => {
  if (!outerWrapper.value) return;
  if (!document.fullscreenElement) {
    outerWrapper.value.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

onMounted(() => {
  let lastObservedW = 0;
  let lastObservedH = 0;

  resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;

    if (Math.abs(width - lastObservedW) < 1 && Math.abs(height - lastObservedH) < 1) {
      return;
    }
    lastObservedW = width;
    lastObservedH = height;

    if (resizeDebounce) clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      if (csEnabled) fitAndReset();
    }, 100);
  });

  if (csViewport.value) {
    resizeObserver.observe(csViewport.value);
  }

  document.addEventListener("fullscreenchange", onFullscreenChange);
});

const onFullscreenChange = () => {
  if (resizeDebounce) clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => {
    if (csEnabled) fitAndReset();
  }, 150);
};

onBeforeUnmount(() => {
  cleanupCornerstone();
  if (resizeDebounce) clearTimeout(resizeDebounce);
  if (resizeObserver && csViewport.value) {
    resizeObserver.unobserve(csViewport.value);
  }
  document.removeEventListener("fullscreenchange", onFullscreenChange);
});
</script>

<template>
  <div class="dicom-viewer-wrapper" ref="outerWrapper">
    <v-card class="mb-3 elevation-2 rounded-lg">
      <v-card-title
        class="d-flex flex-wrap align-center justify-space-between ga-2 bg-grey-lighten-4 py-2 px-4"
      >
        <div class="d-flex align-center ga-2">
          <v-chip color="primary" size="small" variant="flat">
            <v-icon start icon="mdi-medical-bag"></v-icon>
            DICOM
          </v-chip>
          <span
            class="text-subtitle-1 font-weight-medium text-truncate"
            style="max-width: 250px"
          >
            {{ fileKey }}
          </span>
        </div>
      </v-card-title>

      <v-card-text class="py-2 px-3 border-t">
        <div class="d-flex flex-wrap align-center justify-space-between ga-3">
          <div
            class="d-flex align-center flex-wrap ga-2 flex-grow-1"
            style="min-width: 280px"
          >
            <div
              v-if="totalFrames > 1"
              class="d-flex align-center ga-1 mr-3"
              style="width: 220px"
            >
              <span class="text-caption font-weight-bold text-primary">Frame:</span>
              <v-slider
                v-model="currentFrame"
                :min="0"
                :max="totalFrames - 1"
                :step="1"
                hide-details
                density="compact"
                color="primary"
              ></v-slider>
              <span class="text-caption" style="width: 50px">
                {{ currentFrame + 1 }} / {{ totalFrames }}
              </span>
            </div>

            <div class="d-flex align-center ga-1" style="width: 190px">
              <span class="text-caption font-weight-bold">W/C:</span>
              <v-slider
                v-model="windowCenter"
                :min="-500"
                :max="2000"
                :step="1"
                hide-details
                density="compact"
              ></v-slider>
              <span class="text-caption" style="width: 35px">{{
                Math.round(windowCenter)
              }}</span>
            </div>

            <div class="d-flex align-center ga-1" style="width: 190px">
              <span class="text-caption font-weight-bold">W/W:</span>
              <v-slider
                v-model="windowWidth"
                :min="1"
                :max="4000"
                :step="1"
                hide-details
                density="compact"
              ></v-slider>
              <span class="text-caption" style="width: 35px">{{
                Math.round(windowWidth)
              }}</span>
            </div>

            <v-menu location="bottom">
              <template v-slot:activator="{ props: menuProps }">
                <v-btn
                  v-bind="menuProps"
                  size="small"
                  variant="outlined"
                  density="comfortable"
                >
                  Presets <v-icon end icon="mdi-chevron-down"></v-icon>
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item @click="applyPreset('default')">Standard DICOM</v-list-item>
                <v-list-item @click="applyPreset('bone')">Knochen (Bone)</v-list-item>
                <v-list-item @click="applyPreset('soft')"
                  >Weichgewebe (Soft Tissue)</v-list-item
                >
                <v-list-item @click="applyPreset('contrast')">Hoher Kontrast</v-list-item>
              </v-list>
            </v-menu>
          </div>

          <div class="d-flex align-center ga-1">
            <v-btn
              icon="mdi-magnify-plus-outline"
              size="small"
              variant="text"
              @click="zoomIn"
              title="Zoom In"
            ></v-btn>
            <v-btn
              icon="mdi-magnify-minus-outline"
              size="small"
              variant="text"
              @click="zoomOut"
              title="Zoom Out"
            ></v-btn>
            <v-btn
              :icon="invert ? 'mdi-invert-colors-off' : 'mdi-invert-colors'"
              size="small"
              variant="text"
              :color="invert ? 'primary' : ''"
              @click="invert = !invert"
              title="Invertieren"
            ></v-btn>
            <v-btn
              icon="mdi-refresh"
              size="small"
              variant="text"
              @click="resetView()"
              title="Zurücksetzen"
            ></v-btn>
            <v-btn
              icon="mdi-fullscreen"
              size="small"
              variant="text"
              @click="toggleFullscreen()"
              title="Vollbild"
            ></v-btn>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card
      class="elevation-3 overflow-hidden rounded-lg position-relative bg-black d-flex flex-column"
      style="height: 70vh; min-height: 420px"
    >
      <div
        v-if="loading"
        class="d-flex flex-column align-center justify-center position-absolute fill-height w-100 bg-black"
        style="z-index: 10"
      >
        <template v-if="isDownloading">
          <v-progress-circular
            v-if="downloadProgress >= 0"
            :model-value="downloadProgress"
            color="primary"
            size="64"
            width="6"
          >
            {{ downloadProgress }}%
          </v-progress-circular>

          <v-progress-circular
            v-else
            indeterminate
            color="primary"
            size="64"
            width="6"
          ></v-progress-circular>
          <span class="mt-4 text-grey-lighten-1">Lade DICOM Datei...</span>
        </template>

        <template v-else>
          <v-progress-circular
            indeterminate
            color="secondary"
            size="64"
            width="6"
          ></v-progress-circular>
          <span class="mt-4 text-grey-lighten-1">Verarbeite Bilddaten...</span>
        </template>
      </div>

      <div
        v-else-if="errorMessage"
        class="d-flex flex-column align-center justify-center fill-height pa-6 text-center"
      >
        <v-icon icon="mdi-alert-circle" color="error" size="64"></v-icon>
        <p class="text-h6 text-error mt-2">{{ errorMessage }}</p>
        <v-btn color="primary" class="mt-4" :href="presignedUrl" target="_blank" download>
          Datei herunterladen
        </v-btn>
      </div>

      <div
        v-show="!loading && !errorMessage"
        class="viewport-container cursor-grab flex-grow-1"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @wheel="onWheel"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        style="
          display: flex;
          width: 100%;
          min-height: 0;
          touch-action: none;
          position: relative;
        "
      >
        <div
          ref="csViewport"
          class="cornerstone-viewport"
          style="width: 100%; height: 100%; position: relative"
        ></div>
      </div>
    </v-card>

    <div
      v-if="!loading && !errorMessage"
      class="d-flex justify-space-between align-center px-2 py-1 text-caption text-grey"
    >
      <span
        >W/C: {{ Math.round(windowCenter) }} | W/W: {{ Math.round(windowWidth) }} | Zoom:
        {{ Math.round(zoomScale * 100) }}%</span
      >
      <span
        >Tipp: Mausrad für
        {{ totalFrames > 1 ? "Bildlauf, Shift+Mausrad für Zoom" : "Zoom" }}, Ziehen zum
        Verschieben, Shift+Ziehen für Helligkeit/Kontrast</span
      >
    </div>
  </div>
</template>

<style scoped>
.dicom-viewer-wrapper {
  width: 100%;
}
.cursor-grab {
  cursor: grab;
}
.cursor-grab:active {
  cursor: grabbing;
}
.cornerstone-viewport {
  position: relative;
  overflow: hidden;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
