/**
 * Service Worker for the GUI
 * This section imports the necessary scripts for the GUI
 * @module GUI/service-worker
 * @requires jQuery
 */
try {
  importScripts('./popup.js');
  console.log("initialized");
} catch (e) {
  console.error("SERVICE WORKER: ", e);
}