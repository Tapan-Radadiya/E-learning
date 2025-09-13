import client from "prom-client"

export const enablePrometheus = () => {
    try {
        const collectedMetrics = client.collectDefaultMetrics
        collectedMetrics({ register: client.register })
        console.log("Prometheus Client Enabled ✅")
    } catch (error) {
        console.log("Error Enabling Prometheus Client ❌")
    }
}   