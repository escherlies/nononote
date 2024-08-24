/* eslint-disable no-console */
/// <reference lib="webworker" />

import { manifest, version } from "@parcel/service-worker"

const sw = self as unknown as ServiceWorkerGlobalScope & typeof globalThis

async function install() {
  const cache = await caches.open(version)
  await cache.addAll(manifest)
  sw.skipWaiting() // Skip waiting to activate the service worker immediately
}

sw.addEventListener("install", (e) => e.waitUntil(install()))

async function activate() {
  const keys = await caches.keys()
  await Promise.all(keys.map((key) => key !== version && caches.delete(key)))
  sw.clients.claim() // Claim clients to ensure the service worker takes control immediately
}

sw.addEventListener("activate", (e) => e.waitUntil(activate()))
