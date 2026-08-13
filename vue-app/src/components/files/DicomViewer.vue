<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick, inject, onMounted, computed } from "vue";
import dicomParser from "dicom-parser";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import { IDicomMetaData } from "@/interfaces/IDicomMetaData";
import { FileService } from "@/services/FileService";

const axios: any = inject("axios");
const fileService = new FileService(axios);

// Configure Cornerstone WADO loader external dependencies
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

// Viewer Mode: 'cornerstone' | 'mobile' | 'tags'
const viewerMode = ref<"cornerstone" | "mobile" | "tags">("cornerstone");

const loading = ref(true);
const errorMessage = ref("");

// DOM element references
const csViewport = ref<HTMLDivElement | null>(null);
const mobileCanvas = ref<HTMLCanvasElement | null>(null);
const viewerContainer = ref<HTMLDivElement | null>(null);

// Parsed DICOM Data
const arrayBufferData = ref<ArrayBuffer | null>(null);
const parsedDataSet = ref<any>(null);
const pixelDataBytes = ref<Uint8Array | Uint16Array | Int16Array | null>(null);

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
const windowCenter = ref(128);
const windowWidth = ref(256);
const invert = ref(false);

// Used by the mobile canvas only
const zoomScale = ref(1.0);
const panX = ref(0);
const panY = ref(0);

const isFullscreen = ref(false);

// Cornerstone state
let csImageId: string | null = null;
let csEnabled = false;
let resizeObserver: ResizeObserver | null = null;

// Stores the Cornerstone scale after fitToWindow().
// It is only used as the reference point for displaying zoom percentage.
const cornerstoneFitScale = ref(1);

// Format DICOM date helper (YYYYMMDD -> YYYY-MM-DD)
const formatDate = (rawStr: string | undefined): string => {
  if (!rawStr || rawStr.length < 8) return rawStr || "-";
  return `${rawStr.substring(0, 4)}-${rawStr.substring(4, 6)}-${rawStr.substring(6, 8)}`;
};

// Load DICOM file array buffer and parse header tags
const loadDicomData = async () => {
  if (!props.fileKey && !props.presignedUrl) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    let buffer: ArrayBuffer;

    try {
      buffer = await fileService.downloadFileArrayBuffer(props.fileKey);
    } catch (proxyErr) {
      console.warn("Backend proxy fetch failed, trying presignedUrl...", proxyErr);

      const response = await fetch(props.presignedUrl);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      buffer = await response.arrayBuffer();
    }

    arrayBufferData.value = buffer;

    const byteArray = new Uint8Array(buffer);
    const dataSet = dicomParser.parseDicom(byteArray);
    parsedDataSet.value = dataSet;

    // Read DICOM header attributes
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

    // Set initial windowing state
    windowCenter.value = meta.value.windowCenter || 128;
    windowWidth.value = meta.value.windowWidth || 256;

    if (windowWidth.value <= 0) {
      windowWidth.value = 256;
    }

    // Extract Pixel Data
    const pixelDataElement = dataSet.elements.x7fe00010;

    if (pixelDataElement) {
      if (meta.value.bitsAllocated === 8) {
        pixelDataBytes.value = new Uint8Array(
          byteArray.buffer,
          pixelDataElement.dataOffset,
          pixelDataElement.length
        );
      } else {
        if (meta.value.pixelRepresentation === 1) {
          pixelDataBytes.value = new Int16Array(
            byteArray.buffer,
            pixelDataElement.dataOffset,
            pixelDataElement.length / 2
          );
        } else {
          pixelDataBytes.value = new Uint16Array(
            byteArray.buffer,
            pixelDataElement.dataOffset,
            pixelDataElement.length / 2
          );
        }
      }
    }

    loading.value = false;

    await nextTick();

    renderCurrentMode();
  } catch (err: any) {
    console.error("Error loading DICOM file:", err);

    errorMessage.value = `Fehler beim Laden der DICOM-Datei: ${err?.message || err}`;

    loading.value = false;
  }
};

// Clean up Cornerstone instance
const cleanupCornerstone = () => {
  if (csViewport.value && csEnabled) {
    try {
      cornerstone.disable(csViewport.value);
    } catch {}

    csEnabled = false;
  }

  csImageId = null;
};

// Get the current Cornerstone zoom relative to its fitted scale
const cornerstoneZoomPercent = computed(() => {
  if (!csViewport.value || !csEnabled || cornerstoneFitScale.value <= 0) {
    return 100;
  }

  try {
    const viewport = cornerstone.getViewport(csViewport.value);

    if (!viewport || viewport.scale <= 0) {
      return 100;
    }

    return Math.round((viewport.scale / cornerstoneFitScale.value) * 100);
  } catch {
    return 100;
  }
});

// Update the displayed zoom value after Cornerstone changes
const updateCornerstoneZoomReference = () => {
  if (!csViewport.value || !csEnabled) return;

  try {
    const viewport = cornerstone.getViewport(csViewport.value);

    if (viewport && viewport.scale > 0) {
      // The computed property reads the actual viewport.
      // This function exists mainly to make the intent explicit.
    }
  } catch {
    // Ignore if viewport isn't available yet.
  }
};

// Initialize CornerstoneJS Viewport
const initCornerstone = async () => {
  if (!arrayBufferData.value) return;

  await nextTick();

  if (!csViewport.value) return;

  try {
    cleanupCornerstone();

    cornerstone.enable(csViewport.value);
    csEnabled = true;

    // Register blob as Cornerstone image
    const blob = new Blob([arrayBufferData.value], {
      type: "application/dicom",
    });

    csImageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(blob);

    const image = await cornerstone.loadImage(csImageId);

    cornerstone.displayImage(csViewport.value, image);

    // Let Cornerstone calculate the correct initial scale
    // and translation for the viewport.
    cornerstone.resize(csViewport.value);
    cornerstone.fitToWindow(csViewport.value);

    const viewport = cornerstone.getViewport(csViewport.value);

    if (viewport) {
      cornerstoneFitScale.value = viewport.scale;

      viewport.voi.windowWidth = windowWidth.value;
      viewport.voi.windowCenter = windowCenter.value;
      viewport.invert = invert.value;

      cornerstone.setViewport(csViewport.value, viewport);
    }

    updateCornerstoneZoomReference();
  } catch (err: any) {
    console.warn("Cornerstone display error:", err);
  }
};

// Update only the DICOM display properties.
// Zoom and translation remain completely controlled by Cornerstone.
const updateCornerstoneDisplay = () => {
  if (!csViewport.value || !csEnabled) return;

  try {
    const viewport = cornerstone.getViewport(csViewport.value);

    if (!viewport) return;

    viewport.voi.windowWidth = windowWidth.value;
    viewport.voi.windowCenter = windowCenter.value;
    viewport.invert = invert.value;

    cornerstone.setViewport(csViewport.value, viewport);
  } catch (err) {
    console.warn("Cornerstone display update error:", err);
  }
};

// Zoom using Cornerstone's native viewport
const zoomCornerstone = (factor: number) => {
  if (!csViewport.value || !csEnabled) return;

  try {
    const viewport = cornerstone.getViewport(csViewport.value);

    if (!viewport) return;

    viewport.scale *= factor;

    // Prevent absurdly small/large scales.
    viewport.scale = Math.max(
      cornerstoneFitScale.value * 0.2,
      Math.min(cornerstoneFitScale.value * 5.0, viewport.scale)
    );

    cornerstone.setViewport(csViewport.value, viewport);

    updateCornerstoneZoomReference();
  } catch (err) {
    console.warn("Cornerstone zoom error:", err);
  }
};

// Reset Cornerstone viewport completely
const resetCornerstoneViewport = () => {
  if (!csViewport.value || !csEnabled) return;

  try {
    cornerstone.resize(csViewport.value, true);
    cornerstone.fitToWindow(csViewport.value);

    const viewport = cornerstone.getViewport(csViewport.value);

    if (viewport) {
      cornerstoneFitScale.value = viewport.scale;

      viewport.voi.windowWidth = windowWidth.value;
      viewport.voi.windowCenter = windowCenter.value;
      viewport.invert = invert.value;

      cornerstone.setViewport(csViewport.value, viewport);
    }

    updateCornerstoneZoomReference();
  } catch (err) {
    console.warn("Cornerstone reset error:", err);
  }
};

// Resize Cornerstone without changing the current viewport state
const resizeCornerstone = () => {
  if (!csViewport.value || !csEnabled) return;

  try {
    cornerstone.resize(csViewport.value);
  } catch (err) {
    console.warn("Cornerstone resize error:", err);
  }
};

// Mobile / Touch Canvas Render Loop
const renderMobileCanvas = async () => {
  await nextTick();

  if (!mobileCanvas.value || !pixelDataBytes.value) return;

  const canvas = mobileCanvas.value;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const width = meta.value.columns || 512;
  const height = meta.value.rows || 512;

  canvas.width = width;
  canvas.height = height;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  const pixels = pixelDataBytes.value;
  const numPixels = width * height;

  const wc = windowCenter.value;
  const ww = windowWidth.value > 0 ? windowWidth.value : 1;

  const minVal = wc - 0.5 - (ww - 1) / 2;
  const maxVal = wc - 0.5 + (ww - 1) / 2;

  const isMonochrome1 = meta.value.photometricInterpretation === "MONOCHROME1";

  const slope = meta.value.rescaleSlope || 1;
  const intercept = meta.value.rescaleIntercept || 0;
  const isInv = invert.value;

  for (let i = 0; i < numPixels; i++) {
    const rawVal = pixels[i];
    let val = rawVal * slope + intercept;

    let gray = 0;

    if (val <= minVal) {
      gray = 0;
    } else if (val > maxVal) {
      gray = 255;
    } else {
      gray = Math.round(((val - (wc - 0.5)) / (ww - 1) + 0.5) * 255);
    }

    if (isMonochrome1) {
      gray = 255 - gray;
    }

    if (isInv) {
      gray = 255 - gray;
    }

    const idx = i * 4;

    data[idx] = gray;
    data[idx + 1] = gray;
    data[idx + 2] = gray;
    data[idx + 3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
};

// Switch viewer modes & re-render
const renderCurrentMode = async () => {
  await nextTick();

  if (viewerMode.value === "cornerstone") {
    await initCornerstone();
  } else if (viewerMode.value === "mobile") {
    await renderMobileCanvas();
  }
};

watch(viewerMode, (newMode, oldMode) => {
  if (oldMode === "cornerstone") {
    cleanupCornerstone();
  }

  renderCurrentMode();
});

// Window/Level/invert changes affect both renderers.
// Zoom/pan are handled separately by each renderer.
watch([windowCenter, windowWidth, invert], () => {
  if (viewerMode.value === "cornerstone") {
    updateCornerstoneDisplay();
  } else if (viewerMode.value === "mobile") {
    renderMobileCanvas();
  }
});

// Mobile zoom/pan changes do not affect Cornerstone.
watch([zoomScale, panX, panY], () => {
  if (viewerMode.value === "mobile") {
    // CSS transform handles these values directly.
  }
});

watch(
  () => props.presignedUrl,
  () => {
    loadDicomData();
  },
  { immediate: true }
);

// Presets
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

    case "deep-bone":
      windowCenter.value = 800;
      windowWidth.value = 2500;
      break;

    case "soft":
      windowCenter.value = 40;
      windowWidth.value = 400;
      break;

    case "contrast":
      windowCenter.value = 150;
      windowWidth.value = 600;
      break;

    case "invert":
      invert.value = !invert.value;
      break;
  }
};

const resetView = () => {
  windowCenter.value = meta.value.windowCenter || 128;
  windowWidth.value = meta.value.windowWidth || 256;
  invert.value = false;

  if (viewerMode.value === "cornerstone") {
    resetCornerstoneViewport();
  } else if (viewerMode.value === "mobile") {
    zoomScale.value = 1.0;
    panX.value = 0;
    panY.value = 0;
  }
};

// Pan & Drag handlers
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

  // Right button or Shift key:
  // Adjust Window/Level.
  if (e.buttons === 2 || e.shiftKey) {
    windowWidth.value = Math.max(1, windowWidth.value + dx * 2);

    windowCenter.value += dy * 2;

    return;
  }

  // Cornerstone-native pan
  if (viewerMode.value === "cornerstone") {
    if (!csViewport.value || !csEnabled) return;

    try {
      const viewport = cornerstone.getViewport(csViewport.value);

      if (!viewport) return;

      // Cornerstone owns the translation.
      // No Vue pan state and no scale conversion.
      viewport.translation.x += dx;
      viewport.translation.y += dy;

      cornerstone.setViewport(csViewport.value, viewport);
    } catch (err) {
      console.warn("Cornerstone pan error:", err);
    }

    return;
  }

  // Mobile canvas pan
  panX.value += dx;
  panY.value += dy;
};

const onMouseUp = () => {
  isDragging = false;
};

const onWheel = (e: WheelEvent) => {
  e.preventDefault();

  if (viewerMode.value === "cornerstone") {
    zoomCornerstone(e.deltaY < 0 ? 1.1 : 0.9);
    return;
  }

  // Mobile canvas zoom
  if (e.deltaY < 0) {
    zoomScale.value = Math.min(5.0, zoomScale.value + 0.1);
  } else {
    zoomScale.value = Math.max(0.2, zoomScale.value - 0.1);
  }
};

// Touch Handlers
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

    if (viewerMode.value === "cornerstone") {
      if (!csViewport.value || !csEnabled) return;

      try {
        const viewport = cornerstone.getViewport(csViewport.value);

        if (!viewport) return;

        viewport.translation.x += dx;
        viewport.translation.y += dy;

        cornerstone.setViewport(csViewport.value, viewport);
      } catch (err) {
        console.warn("Cornerstone touch pan error:", err);
      }
    } else {
      panX.value += dx;
      panY.value += dy;
    }
  } else if (e.touches.length === 2 && touchStartDist > 0) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );

    const diff = (dist - touchStartDist) * 0.005;

    if (viewerMode.value === "cornerstone") {
      // Convert the pinch change into a multiplicative
      // zoom factor for Cornerstone.
      const factor = 1 + diff;

      zoomCornerstone(Math.max(0.8, Math.min(1.2, factor)));
    } else {
      zoomScale.value = Math.min(5.0, Math.max(0.2, zoomScale.value + diff));
    }

    touchStartDist = dist;
  }
};

const onTouchEnd = () => {
  isDragging = false;
  touchStartDist = 0;
};

const toggleFullscreen = () => {
  if (!viewerContainer.value) return;

  if (!document.fullscreenElement) {
    viewerContainer.value.requestFullscreen().then(() => {
      isFullscreen.value = true;

      // Give the browser a moment to apply the fullscreen
      // dimensions before resizing Cornerstone.
      nextTick(() => {
        if (viewerMode.value === "cornerstone") {
          resizeCornerstone();
        }
      });
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;

      nextTick(() => {
        if (viewerMode.value === "cornerstone") {
          resizeCornerstone();
        }
      });
    });
  }
};

onMounted(() => {
  // Observe viewport size changes.
  // Do NOT call fitToWindow() here because that would reset
  // the user's zoom and pan whenever the container changes size.
  resizeObserver = new ResizeObserver(() => {
    if (viewerMode.value === "cornerstone" && csViewport.value && csEnabled) {
      resizeCornerstone();
    }
  });

  if (csViewport.value) {
    resizeObserver.observe(csViewport.value);
  }
});

onBeforeUnmount(() => {
  cleanupCornerstone();

  if (resizeObserver && csViewport.value) {
    resizeObserver.unobserve(csViewport.value);
  }

  resizeObserver?.disconnect();
});
</script>

<template>
  <div class="dicom-viewer-wrapper" ref="viewerContainer">
    <!-- Header / Controls Bar -->
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

        <!-- Mode Selector -->
        <v-btn-toggle
          v-model="viewerMode"
          mandatory
          color="primary"
          density="comfortable"
          rounded="lg"
        >
          <v-btn value="cornerstone" size="small">
            <v-icon start icon="mdi-monitor"></v-icon>
            CornerstoneJS
          </v-btn>

          <v-btn value="mobile" size="small">
            <v-icon start icon="mdi-cellphone"></v-icon>
            Touch / Mobile
          </v-btn>

          <v-btn value="tags" size="small">
            <v-icon start icon="mdi-file-document-outline"></v-icon>
            DICOM Tags
          </v-btn>
        </v-btn-toggle>
      </v-card-title>

      <!-- Viewport Toolbar -->
      <v-card-text v-if="viewerMode !== 'tags'" class="py-2 px-3 border-t">
        <div class="d-flex flex-wrap align-center justify-space-between ga-3">
          <!-- W/L Sliders & Presets -->
          <div
            class="d-flex align-center flex-wrap ga-2 flex-grow-1"
            style="min-width: 280px"
          >
            <div class="d-flex align-center ga-1" style="width: 190px">
              <span class="text-caption font-weight-bold"> W/C: </span>

              <v-slider
                v-model="windowCenter"
                :min="-500"
                :max="2000"
                :step="1"
                hide-details
                density="compact"
              ></v-slider>

              <span class="text-caption" style="width: 35px">
                {{ Math.round(windowCenter) }}
              </span>
            </div>

            <div class="d-flex align-center ga-1" style="width: 190px">
              <span class="text-caption font-weight-bold"> W/W: </span>

              <v-slider
                v-model="windowWidth"
                :min="1"
                :max="4000"
                :step="1"
                hide-details
                density="compact"
              ></v-slider>

              <span class="text-caption" style="width: 35px">
                {{ Math.round(windowWidth) }}
              </span>
            </div>

            <!-- Presets -->
            <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  variant="outlined"
                  density="comfortable"
                >
                  Presets
                  <v-icon end icon="mdi-chevron-down"></v-icon>
                </v-btn>
              </template>

              <v-list density="compact">
                <v-list-item @click="applyPreset('default')">
                  Standard DICOM
                </v-list-item>

                <v-list-item @click="applyPreset('bone')"> Knochen (Bone) </v-list-item>

                <v-list-item @click="applyPreset('soft')">
                  Weichgewebe (Soft Tissue)
                </v-list-item>

                <v-list-item @click="applyPreset('contrast')">
                  Hoher Kontrast
                </v-list-item>

                <v-list-item @click="applyPreset('invert')"> Invertieren </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex align-center ga-1">
            <v-btn
              icon="mdi-magnify-plus-outline"
              size="small"
              variant="text"
              @click="
                viewerMode === 'cornerstone'
                  ? zoomCornerstone(1.2)
                  : (zoomScale = Math.min(5.0, zoomScale + 0.2))
              "
              title="Zoom In"
            ></v-btn>

            <v-btn
              icon="mdi-magnify-minus-outline"
              size="small"
              variant="text"
              @click="
                viewerMode === 'cornerstone'
                  ? zoomCornerstone(1 / 1.2)
                  : (zoomScale = Math.max(0.2, zoomScale - 0.2))
              "
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

    <!-- Main Viewport / Display Area -->
    <v-card
      class="elevation-3 overflow-hidden rounded-lg position-relative bg-black d-flex flex-column"
      style="min-height: 420px"
    >
      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="d-flex flex-column align-center justify-center position-absolute fill-height w-100 bg-black"
        style="z-index: 10"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        ></v-progress-circular>

        <span class="mt-3 text-grey-lighten-1"> Lade DICOM Bilddaten... </span>
      </div>

      <!-- Error State -->
      <div
        v-else-if="errorMessage"
        class="d-flex flex-column align-center justify-center fill-height pa-6 text-center"
      >
        <v-icon icon="mdi-alert-circle" color="error" size="64"></v-icon>

        <p class="text-h6 text-error mt-2">
          {{ errorMessage }}
        </p>

        <v-btn color="primary" class="mt-4" :href="presignedUrl" target="_blank" download>
          Datei herunterladen
        </v-btn>
      </div>

      <!-- Mode 1: CornerstoneJS Viewport -->
      <div
        v-if="!loading && !errorMessage && viewerMode === 'cornerstone'"
        class="viewport-container d-flex align-center justify-center cursor-grab flex-grow-1"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @wheel="onWheel"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        style="width: 100%; height: 100%; touch-action: none; position: relative"
      >
        <div
          ref="csViewport"
          class="cornerstone-viewport"
          style="width: 100%; height: 100%; position: relative"
        ></div>
      </div>

      <!-- Mode 2: Touch / Mobile Canvas Viewport -->
      <div
        v-if="!loading && !errorMessage && viewerMode === 'mobile'"
        class="viewport-container d-flex align-center justify-center cursor-grab flex-grow-1"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @wheel="onWheel"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        style="width: 100%; height: 100%; touch-action: none; position: relative"
      >
        <canvas
          ref="mobileCanvas"
          class="mobile-canvas"
          :style="{
            transform: `translate(${panX}px, ${panY}px) scale(${zoomScale})`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }"
        ></canvas>
      </div>

      <!-- Mode 3: DICOM Tags & Header Inspector -->
      <div
        v-if="!loading && !errorMessage && viewerMode === 'tags'"
        class="pa-4 bg-grey-darken-4 text-white overflow-y-auto"
        style="max-height: 500px"
      >
        <h3 class="text-h6 font-weight-bold mb-3 d-flex align-center ga-2">
          <v-icon icon="mdi-information-outline" color="primary"></v-icon>

          DICOM Header Metadaten
        </h3>

        <v-table density="compact" class="bg-grey-darken-3 text-white rounded">
          <thead>
            <tr>
              <th class="text-left font-weight-bold">Attribut</th>

              <th class="text-left font-weight-bold">Wert</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Patienten Name</td>
              <td>{{ meta.patientName }}</td>
            </tr>

            <tr>
              <td>Patienten ID</td>
              <td>{{ meta.patientId }}</td>
            </tr>

            <tr>
              <td>Modalität (Modality)</td>
              <td>
                <v-chip size="x-small" color="primary">
                  {{ meta.modality }}
                </v-chip>
              </td>
            </tr>

            <tr>
              <td>Untersuchungsdatum (Study Date)</td>
              <td>{{ meta.studyDate }}</td>
            </tr>

            <tr>
              <td>Auflösung (Rows x Columns)</td>
              <td>{{ meta.columns }} x {{ meta.rows }} px</td>
            </tr>

            <tr>
              <td>Bits Allokiert / Gespeichert</td>
              <td>{{ meta.bitsAllocated }} / {{ meta.bitsStored }} bits</td>
            </tr>

            <tr>
              <td>Pixel Representation</td>
              <td>
                {{
                  meta.pixelRepresentation === 1
                    ? "Vorzeichenbehaftet (Signed)"
                    : "Vorzeichenlos (Unsigned)"
                }}
              </td>
            </tr>

            <tr>
              <td>Photometric Interpretation</td>
              <td>
                {{ meta.photometricInterpretation }}
              </td>
            </tr>

            <tr>
              <td>Rescale Slope / Intercept</td>
              <td>
                {{ meta.rescaleSlope }} /
                {{ meta.rescaleIntercept }}
              </td>
            </tr>

            <tr>
              <td>Window Center / Width (W/C, W/W)</td>
              <td>
                {{ meta.windowCenter }} /
                {{ meta.windowWidth }}
              </td>
            </tr>

            <tr>
              <td>Transfer Syntax UID</td>
              <td class="text-caption">
                {{ meta.transferSyntaxUid }}
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="mt-4 text-right">
          <v-btn
            color="primary"
            variant="flat"
            :href="presignedUrl"
            target="_blank"
            download
          >
            <v-icon start icon="mdi-download"></v-icon>

            Raw DICOM (.dcm) herunterladen
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Footer Overlay info -->
    <div
      v-if="!loading && !errorMessage && viewerMode !== 'tags'"
      class="d-flex justify-space-between align-center px-2 py-1 text-caption text-grey"
    >
      <span>
        W/C: {{ Math.round(windowCenter) }} | W/W: {{ Math.round(windowWidth) }} | Zoom:

        {{
          viewerMode === "cornerstone"
            ? cornerstoneZoomPercent
            : Math.round(zoomScale * 100)
        }}%
      </span>

      <span> Tipp: Ziehen zum Verschieben, Shift+Ziehen für Helligkeit/Kontrast </span>
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
}
</style>
