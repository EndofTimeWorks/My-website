const reportWebVitals = (onPerfEntry?: (metric: any) => void): void => {
    if (onPerfEntry && typeof onPerfEntry === 'function') {
        import('web-vitals').then((vitals) => {
            const { onCLS, onFID, onFCP, onLCP, onTTFB } = vitals;
            onCLS(onPerfEntry);
            onFID(onPerfEntry);
            onFCP(onPerfEntry);
            onLCP(onPerfEntry);
            onTTFB(onPerfEntry);
        }).catch((error) => {
            console.error('Error loading web-vitals:', error);
        });
    }
};

export default reportWebVitals;
