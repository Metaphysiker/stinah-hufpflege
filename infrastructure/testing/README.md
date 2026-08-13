# Playwright Testing Environment

This directory contains the Docker Compose setup for running Playwright end-to-end tests against the application.

## Running the tests

1.  Navigate to this directory (`infrastructure/testing`).
2.  Run the following command:

    ```bash
    docker-compose up --build
    ```

This will build the necessary Docker images and start all the services, including the `playwright` service which will execute the tests.

The `playwright` service will run the tests and then exit. You can check the logs of the `playwright` container to see the test results. A `playwright-report` directory will be created in `vue-app` with an HTML report of the test execution.
