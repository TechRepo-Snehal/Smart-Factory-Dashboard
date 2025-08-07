/**
 * Smart Factory Dashboard JavaScript
 * Handles data fetching, UI updates, and chart management
 */

class FactoryDashboard {
    constructor() {
        this.charts = {};
        this.refreshInterval = null;
        this.lastUpdateTime = null;
        this.isLoading = false;
        this.currentSite = 'germany'; // Default site
        
        this.init();
    }

    init() {
        console.log('Initializing Factory Dashboard...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Update current time
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        
        // Initial data load
        this.loadAllData();
        
        // Set up auto-refresh
        this.setupAutoRefresh();
        
        // Hide loading overlay after initial load
        setTimeout(() => this.hideLoadingOverlay(), 2000);
    }

    setupEventListeners() {
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadAllData();
        });

        // Site buttons
        document.querySelectorAll('.site-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                document.querySelectorAll('.site-btn').forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
                // Update current site
                this.currentSite = e.target.getAttribute('data-site');
                this.loadAllData();
            });
        });

        // Time range selector
        document.getElementById('timeRange').addEventListener('change', (e) => {
            this.loadHistoricalData(e.target.value);
        });

        // Window resize handler for charts
        window.addEventListener('resize', () => {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.resize === 'function') {
                    chart.resize();
                }
            });
        });
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('current-time').textContent = timeString;
    }

    showLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'flex';
        this.isLoading = true;
    }

    hideLoadingOverlay() {
        document.getElementById('loadingOverlay').style.display = 'none';
        this.isLoading = false;
    }

    updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = timeString;
        this.lastUpdateTime = now;
    }

    async loadAllData() {
        if (this.isLoading) return;

        try {
            this.showLoadingState();
            
            // Load all data concurrently
            const [
                sensorData,
                mesData,
                erpData,
                workOrders,
                productionMetrics
            ] = await Promise.all([
                this.fetchData(`/api/sensor-data?site=${this.currentSite}`),
                this.fetchData(`/api/mes-data?site=${this.currentSite}`),
                this.fetchData(`/api/erp-data?site=${this.currentSite}`),
                this.fetchData(`/api/work-orders?site=${this.currentSite}`),
                this.fetchData(`/api/production-metrics?site=${this.currentSite}`)
            ]);

            // Update UI components
            this.updateSensorWidgets(sensorData);
            this.updateProductionLines(mesData);
            this.updateOEEChart(mesData);
            this.updateWorkOrders(workOrders);
            this.updateInventoryStatus(erpData);
            this.updateFinancialMetrics(erpData);
            this.updateQualityMetrics(mesData);
            this.updateDailyProductionMetrics(productionMetrics);
            this.updateDowntimeMetrics(productionMetrics);
            this.updateWeeklyPerformanceMetrics(productionMetrics);
            this.updateEfficiencyChart(productionMetrics);

            
            // Load historical data for charts
            const timeRange = document.getElementById('timeRange').value;
            await this.loadHistoricalData(timeRange);

            this.updateLastUpdateTime();
            this.hideLoadingState();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showErrorState('Failed to load dashboard data. Please try again.');
            this.hideLoadingState();
        }
    }

    async fetchData(endpoint) {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Unknown error occurred');
        }
        return result.data;
    }

    showLoadingState() {
        // Add loading classes to widgets
        document.querySelectorAll('.widget-card').forEach(widget => {
            widget.classList.add('pulse');
        });
    }

    hideLoadingState() {
        // Remove loading classes
        document.querySelectorAll('.widget-card').forEach(widget => {
            widget.classList.remove('pulse');
        });
    }

    showErrorState(message) {
        // You could implement a toast notification or error banner here
        console.error(message);
    }

    updateSensorWidgets(sensorData) {
        // Temperature
        this.updateSensorWidget('temp', sensorData.temperature);
        
        // Pressure
        this.updateSensorWidget('pressure', sensorData.pressure);
        
        // Humidity
        this.updateSensorWidget('humidity', sensorData.humidity);
        
        // Vibration
        this.updateSensorWidget('vibration', sensorData.vibration);
    }

    updateSensorWidget(type, data) {
        const valueEl = document.getElementById(`${type}Value`);
        const locationEl = document.getElementById(`${type}Location`);
        const statusEl = document.getElementById(`${type}Status`);

        if (valueEl) valueEl.textContent = `${data.value} ${data.unit}`;
        if (locationEl) locationEl.textContent = data.location;
        if (statusEl) {
            statusEl.textContent = data.status;
            statusEl.className = `widget-status status-${data.status}`;
        }
    }

    updateProductionLines(mesData) {
        const container = document.getElementById('productionLines');
        container.innerHTML = '';

        mesData.production_lines.forEach(line => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'col-md-4';
            
            const efficiency = Math.min(100, line.efficiency);
            const outputPercentage = Math.round((line.output_rate / line.target_rate) * 100);

            lineDiv.innerHTML = `
                <div class="production-line">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">${line.name}</h6>
                        <span class="line-status ${line.status}">${line.status}</span>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted">Efficiency: ${efficiency}%</small>
                        <div class="efficiency-bar">
                            <div class="efficiency-fill" style="width: ${efficiency}%"></div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-between">
                        <small>Output: ${line.output_rate}/${line.target_rate}</small>
                        <small class="${outputPercentage >= 100 ? 'text-success' : outputPercentage >= 80 ? 'text-warning' : 'text-danger'}">
                            ${outputPercentage}%
                        </small>
                    </div>
                </div>
            `;
            
            container.appendChild(lineDiv);
        });
    }

    updateOEEChart(mesData) {
        const ctx = document.getElementById('oeeChart').getContext('2d');
        
        if (this.charts.oee) {
            this.charts.oee.destroy();
        }

        const oeeData = mesData.overall_equipment_effectiveness;
        
        this.charts.oee = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Availability', 'Performance', 'Quality'],
                datasets: [{
                    data: [
                        oeeData.availability,
                        oeeData.performance,
                        oeeData.quality
                    ],
                    backgroundColor: [
                        '#3b82f6',
                        '#10b981',
                        '#f59e0b'
                    ],
                    borderColor: 'rgba(30, 41, 59, 0.1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#1e293b',
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });

        // Clear any existing OEE value elements
        const existingOeeValues = ctx.canvas.parentElement.querySelectorAll('.oee-center-value');
        existingOeeValues.forEach(element => element.remove());
        
        // Add OEE value in center
        const oeeValue = document.createElement('div');
        oeeValue.className = 'oee-center-value';
        oeeValue.style.position = 'absolute';
        oeeValue.style.top = '45%';
        oeeValue.style.left = '50%';
        oeeValue.style.transform = 'translate(-50%, -50%)';
        oeeValue.style.fontSize = '2.5rem';
        oeeValue.style.fontWeight = '900';
        oeeValue.style.color = '#1e293b';
        oeeValue.style.textShadow = 'none';
        oeeValue.style.zIndex = '10';
        oeeValue.style.pointerEvents = 'none';
        oeeValue.textContent = `${oeeData.oee}%`;
        
        ctx.canvas.parentElement.style.position = 'relative';
        ctx.canvas.parentElement.appendChild(oeeValue);
    }

    updateWorkOrders(workOrders) {
        const container = document.getElementById('workOrdersList');
        container.innerHTML = '';

        workOrders.forEach(order => {
            const orderDiv = document.createElement('div');
            orderDiv.className = 'work-order-item fade-in';
            
            orderDiv.innerHTML = `
                <div class="work-order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-priority priority-${order.priority}">${order.priority}</span>
                </div>
                <div class="mb-2">
                    <strong>${order.product}</strong> - Qty: ${order.quantity}
                </div>
                <div class="mb-2">
                    <small class="text-muted">Line: ${order.assigned_line} | Due: ${order.due_date}</small>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${order.progress}%"></div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                    <small class="text-muted">Progress</small>
                    <small class="text-primary">${order.progress}%</small>
                </div>
            `;
            
            container.appendChild(orderDiv);
        });
    }

    updateInventoryStatus(erpData) {
        const container = document.getElementById('inventoryStatus');
        container.innerHTML = '';

        const inventory = erpData.inventory.raw_materials;
        
        Object.entries(inventory).forEach(([material, data]) => {
            const isLow = data.current_stock <= data.minimum_stock;
            const percentage = (data.current_stock / (data.minimum_stock * 2)) * 100;
            
            const materialDiv = document.createElement('div');
            materialDiv.className = 'metric-row';
            materialDiv.innerHTML = `
                <div>
                    <div class="metric-label">${material.replace(/_/g, ' ').toUpperCase()}</div>
                    <small class="text-muted">${data.current_stock} ${data.unit}</small>
                </div>
                <div class="text-end">
                    <span class="metric-value-small ${isLow ? 'metric-negative' : 'metric-positive'}">
                        ${Math.round(percentage)}%
                    </span>
                </div>
            `;
            
            container.appendChild(materialDiv);
        });
    }

    updateFinancialMetrics(erpData) {
        const container = document.getElementById('financialMetrics');
        container.innerHTML = '';

        const financial = erpData.financial_metrics;
        const profitMargin = ((financial.daily_revenue - financial.production_cost) / financial.daily_revenue * 100);
        const targetPercentage = (financial.daily_revenue / financial.target_revenue * 100);
        
        // Get currency symbol
        const currencySymbol = financial.currency === 'EUR' ? '€' : financial.currency === 'GBP' ? '£' : '$';

        const metrics = [
            {
                label: 'Daily Revenue',
                value: `${currencySymbol}${financial.daily_revenue.toLocaleString()}`,
                class: 'metric-positive'
            },
            {
                label: 'Production Cost',
                value: `${currencySymbol}${financial.production_cost.toLocaleString()}`,
                class: 'metric-neutral'
            },
            {
                label: 'Profit Margin',
                value: `${profitMargin.toFixed(1)}%`,
                class: profitMargin > 30 ? 'metric-positive' : 'metric-warning'
            },
            {
                label: 'Target Achievement',
                value: `${targetPercentage.toFixed(1)}%`,
                class: targetPercentage >= 100 ? 'metric-positive' : 'metric-warning'
            }
        ];

        metrics.forEach(metric => {
            const metricDiv = document.createElement('div');
            metricDiv.className = 'metric-row';
            metricDiv.innerHTML = `
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value-small ${metric.class}">${metric.value}</div>
            `;
            container.appendChild(metricDiv);
        });
    }

    updateQualityMetrics(mesData) {
        const container = document.getElementById('qualityMetrics');
        container.innerHTML = '';

        const quality = mesData.quality_metrics;

        const metrics = [
            {
                label: 'Defect Rate',
                value: `${quality.defect_rate}%`,
                class: quality.defect_rate < 1 ? 'metric-positive' : quality.defect_rate < 2 ? 'metric-warning' : 'metric-negative'
            },
            {
                label: 'First Pass Yield',
                value: `${quality.first_pass_yield}%`,
                class: quality.first_pass_yield > 98 ? 'metric-positive' : quality.first_pass_yield > 95 ? 'metric-warning' : 'metric-negative'
            },
            {
                label: 'Rework Rate',
                value: `${quality.rework_rate}%`,
                class: quality.rework_rate < 1 ? 'metric-positive' : quality.rework_rate < 2 ? 'metric-warning' : 'metric-negative'
            }
        ];

        metrics.forEach(metric => {
            const metricDiv = document.createElement('div');
            metricDiv.className = 'metric-row';
            metricDiv.innerHTML = `
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value-small ${metric.class}">${metric.value}</div>
            `;
            container.appendChild(metricDiv);
        });
    }

    async loadHistoricalData(timeRange) {
        try {
            const historicalData = await this.fetchData(`/api/historical-data?range=${timeRange}&site=${this.currentSite}`);
            this.updateProductionChart(historicalData);
        } catch (error) {
            console.error('Error loading historical data:', error);
        }
    }

    updateProductionChart(historicalData) {
        const ctx = document.getElementById('productionChart').getContext('2d');
        
        if (this.charts.production) {
            this.charts.production.destroy();
        }

        const dataPoints = historicalData.data_points;
        const labels = dataPoints.map(point => point.timestamp);
        const temperatureData = dataPoints.map(point => point.temperature);
        const pressureData = dataPoints.map(point => point.pressure);
        const productionData = dataPoints.map(point => point.production_rate);

        this.charts.production = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Production Rate',
                        data: productionData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Temperature (°C)',
                        data: temperatureData,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#1e293b'
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(30, 41, 59, 0.1)'
                        },
                        ticks: {
                            color: '#1e293b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: {
                            color: 'rgba(30, 41, 59, 0.1)'
                        },
                        ticks: {
                            color: '#1e293b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                        ticks: {
                            color: '#1e293b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }

    setupAutoRefresh() {
        // Refresh data every 30 seconds
        this.refreshInterval = setInterval(() => {
            if (!this.isLoading) {
                this.loadAllData();
            }
        }, 30000);
    }

    destroy() {
        // Clean up intervals and charts
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }

    updateDailyProductionMetrics(productionData) {
        const container = document.getElementById('dailyProductionMetrics');
        container.innerHTML = '';

        const daily = productionData.daily_production;
        const efficiency = daily.efficiency;
        const targetAchievement = Math.round((daily.actual / daily.target) * 100);

        const metrics = [
            {
                label: 'Target',
                value: daily.target.toLocaleString(),
                class: 'metric-neutral'
            },
            {
                label: 'Actual',
                value: daily.actual.toLocaleString(),
                class: daily.actual >= daily.target ? 'metric-positive' : 'metric-warning'
            },
            {
                label: 'Efficiency',
                value: `${efficiency}%`,
                class: efficiency >= 100 ? 'metric-positive' : efficiency >= 90 ? 'metric-warning' : 'metric-negative'
            },
            {
                label: 'Achievement',
                value: `${targetAchievement}%`,
                class: targetAchievement >= 100 ? 'metric-positive' : targetAchievement >= 85 ? 'metric-warning' : 'metric-negative'
            }
        ];

        metrics.forEach(metric => {
            const metricDiv = document.createElement('div');
            metricDiv.className = 'metric-row';
            metricDiv.innerHTML = `
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value-small ${metric.class}">${metric.value}</div>
            `;
            container.appendChild(metricDiv);
        });
    }

    updateDowntimeMetrics(productionData) {
        const container = document.getElementById('downtimeMetrics');
        container.innerHTML = '';

        const downtime = productionData.downtime;
        const totalHours = Math.round(downtime.total_minutes / 60 * 10) / 10;
        const plannedHours = Math.round(downtime.planned / 60 * 10) / 10;
        const unplannedHours = Math.round(downtime.unplanned / 60 * 10) / 10;
        const unplannedPercentage = Math.round((downtime.unplanned / downtime.total_minutes) * 100);

        const metrics = [
            {
                label: 'Total Downtime',
                value: `${totalHours}h`,
                class: totalHours < 2 ? 'metric-positive' : totalHours < 4 ? 'metric-warning' : 'metric-negative'
            },
            {
                label: 'Planned',
                value: `${plannedHours}h`,
                class: 'metric-neutral'
            },
            {
                label: 'Unplanned',
                value: `${unplannedHours}h`,
                class: unplannedHours < 1 ? 'metric-positive' : unplannedHours < 2 ? 'metric-warning' : 'metric-negative'
            },
            {
                label: 'Unplanned %',
                value: `${unplannedPercentage}%`,
                class: unplannedPercentage < 30 ? 'metric-positive' : unplannedPercentage < 50 ? 'metric-warning' : 'metric-negative'
            }
        ];

        metrics.forEach(metric => {
            const metricDiv = document.createElement('div');
            metricDiv.className = 'metric-row';
            metricDiv.innerHTML = `
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value-small ${metric.class}">${metric.value}</div>
            `;
            container.appendChild(metricDiv);
        });
    }

    updateWeeklyPerformanceMetrics(productionData) {
        const container = document.getElementById('weeklyPerformanceMetrics');
        container.innerHTML = '';

        // Calculate weekly averages from trend data
        const weeklyTrend = productionData.weekly_trend;
        const totalProduction = weeklyTrend.reduce((sum, day) => sum + day.production, 0);
        const avgProduction = Math.round(totalProduction / weeklyTrend.length);
        const target = productionData.daily_production.target;
        const weeklyTarget = target * 7;
        const weeklyAchievement = Math.round((totalProduction / weeklyTarget) * 100);
        
        // Find best and worst days
        const bestDay = weeklyTrend.reduce((max, day) => day.production > max.production ? day : max);
        const worstDay = weeklyTrend.reduce((min, day) => day.production < min.production ? day : min);

        const metrics = [
            {
                label: 'Weekly Total',
                value: totalProduction.toLocaleString(),
                class: totalProduction >= weeklyTarget ? 'metric-positive' : 'metric-warning'
            },
            {
                label: 'Daily Average',
                value: avgProduction.toLocaleString(),
                class: avgProduction >= target ? 'metric-positive' : 'metric-warning'
            },
            {
                label: 'Achievement',
                value: `${weeklyAchievement}%`,
                class: weeklyAchievement >= 100 ? 'metric-positive' : weeklyAchievement >= 85 ? 'metric-warning' : 'metric-negative'
            },
            {
                label: `Best: ${bestDay.day}`,
                value: bestDay.production.toLocaleString(),
                class: 'metric-positive'
            }
        ];

        metrics.forEach(metric => {
            const metricDiv = document.createElement('div');
            metricDiv.className = 'metric-row';
            metricDiv.innerHTML = `
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value-small ${metric.class}">${metric.value}</div>
            `;
            container.appendChild(metricDiv);
        });
    }

    updateEfficiencyChart(productionData) {
        const ctx = document.getElementById('efficiencyChart').getContext('2d');
        
        if (this.charts.efficiencyChart) {
            this.charts.efficiencyChart.destroy();
        }

        const weeklyTrend = productionData.weekly_trend;
        const target = productionData.daily_production.target;
        
        this.charts.efficiencyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: weeklyTrend.map(day => day.day),
                datasets: [
                    {
                        label: 'Production',
                        data: weeklyTrend.map(day => day.production),
                        backgroundColor: '#3b82f6',
                        borderColor: '#1e40af',
                        borderWidth: 2
                    },
                    {
                        label: 'Target',
                        data: weeklyTrend.map(() => target),
                        type: 'line',
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointBackgroundColor: '#ef4444',
                        pointBorderColor: '#ffffff',
                        pointBorderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#1e293b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(30, 41, 59, 0.1)'
                        },
                        ticks: {
                            color: '#1e293b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(30, 41, 59, 0.1)'
                        },
                        ticks: {
                            color: '#1e293b',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        });
    }


}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.factoryDashboard = new FactoryDashboard();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.factoryDashboard) {
        window.factoryDashboard.destroy();
    }
});
