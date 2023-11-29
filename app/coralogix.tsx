"use client";
import { useEffect } from "react";

// Can't do an import here either like this because next js
// doesn't like it because window is STILL not available.
// We need to do a dynamic import after we are sure we're on
// the client side.. the only way I have found to reliably do
// that is by importing inside a useEffect hook. which is just...
// dirty.
//import { CoralogixRum } from "@coralogix/browser";
import type { CoralogixDomain } from "@coralogix/browser/src/types";

export async function Coralogix(): Promise<JSX.Element> {
  const initCoralogix = async (): Promise<void> => {
    // do an import here ensures we're actually on the client side when attempting to load.
    //
    // Even doing it this way has its problems.. The RUM is working but it kicks 2 warnings and a "sometimes error":
    // 1) You get an "CoralogixRum already inited." warning on the browser console
    //    (screenshot: screenshots/already_loaded_warning.png)
    // 2) You get a loading warning on the server console:
    //    (screenshot: screenshots/otel-warnings.png)
    //
    // Import trace for requested module:
    // ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
    // ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/index.js
    // ./node_modules/@opentelemetry/instrumentation/build/esm/platform/index.js
    // ./node_modules/@opentelemetry/instrumentation/build/esm/index.js
    // ./node_modules/@coralogix/browser/src/index.js
    // ./app/coralogix.tsx
    //  ⚠ ./node_modules/@opentelemetry/instrumentation/build/esm/platform/node/instrumentation.js
    // Critical dependency: the request of a dependency is an expression
    //
    // The "sometimes error" is a runtime error in dev which is related to the below async await and a loading race condition
    // which appears to be only a next dev server problem as far as I can tell.
    //    (screenshot: screenshots/runtime-error.png)
    const coralogix = (await import("@coralogix/browser")).CoralogixRum;
    coralogix.init({
      public_key: process.env.CORALOGIX_TOKEN as string,
      application: process.env.CORALOGIX_APP_NAME as string,
      version: (process.env.CORALOGIX_APP_VERSION as string) || "0.0.0",
      coralogixDomain: process.env.CORALOGIX_URL as CoralogixDomain,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initCoralogix();
  }, []);

  return <></>;
}
