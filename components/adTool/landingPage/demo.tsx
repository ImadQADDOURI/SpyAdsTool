"use client";

import { motion } from "framer-motion";

import { WorldMap } from "./map";

export default function MapDemo() {
  return (
    <div className="mx-auto w-full max-w-7xl bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xl font-bold text-black dark:text-white md:text-4xl">
          Global Network
        </p>
        <p className="mx-auto max-w-2xl py-4 text-sm text-neutral-500 md:text-lg">
          Connect with teams and clients worldwide. Our platform enables
          seamless collaboration across continents, bringing the world to your
          workspace.
        </p>
      </div>
      <WorldMap
        dots={[
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
              label: "Fairbanks",
            },
            end: {
              lat: 34.0522,
              lng: -118.2437,
              label: "Los Angeles",
            },
          },
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
              label: "Fairbanks",
            },
            end: {
              lat: -15.7975,
              lng: -47.8919,
              label: "Brasília",
            },
          },
          {
            start: {
              lat: -15.7975,
              lng: -47.8919,
              label: "Brasília",
            },
            end: {
              lat: 38.7223,
              lng: -9.1393,
              label: "Lisbon",
            },
          },
          {
            start: {
              lat: 51.5074,
              lng: -0.1278,
              label: "London",
            },
            end: {
              lat: 28.6139,
              lng: 77.209,
              label: "New Delhi",
            },
          },
          {
            start: {
              lat: 28.6139,
              lng: 77.209,
              label: "New Delhi",
            },
            end: {
              lat: 43.1332,
              lng: 131.9113,
              label: "Vladivostok",
            },
          },
          {
            start: {
              lat: 28.6139,
              lng: 77.209,
              label: "New Delhi",
            },
            end: {
              lat: -1.2921,
              lng: 36.8219,
              label: "Nairobi",
            },
          },
        ]}
      />
    </div>
  );
}
