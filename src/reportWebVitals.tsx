import type { Metric } from "web-vitals";

const reportWebVitals = (onPerfEntry?: (metric: Metric) => void): void => {
    if (onPerfEntry && typeof onPerfEntry === "function") {
        import("web-vitals")
            .then((vitals) => {
                const { onCLS, onINP, onFCP, onLCP, onTTFB } = vitals;
                onCLS(onPerfEntry);
                onINP(onPerfEntry);
                onFCP(onPerfEntry);
                onLCP(onPerfEntry);
                onTTFB(onPerfEntry);
            })
            .catch((error) => {
                console.error("Error loading web-vitals:", error);
            });
    }
};

export default reportWebVitals;
