# Smart Factory Dashboard

## Overview

A web-based real-time manufacturing dashboard that provides comprehensive monitoring of factory operations across multiple sites. The application displays sensor data, Manufacturing Execution System (MES) metrics, and Enterprise Resource Planning (ERP) information through an interactive interface. Built as a Flask web application with Bootstrap frontend, it serves mock data to simulate smart factory environments with site-specific variations. Features include sensor monitoring, production line status, work order tracking, and financial metrics with support for Germany and UK manufacturing sites with localized data including different currencies (EUR/GBP), production targets, and regional operational characteristics.

## System Architecture

### Backend Architecture
- **Framework**: Flask-based Python web application with modular route handling
- **Data Layer**: Mock data service pattern using `DataService` class for simulating factory sensor readings and manufacturing metrics
- **API Design**: RESTful endpoints (`/api/sensor-data`, `/api/mes-data`, `/api/erp-data`) returning JSON responses with standardized error handling
- **Configuration**: Environment-based configuration with development defaults and comprehensive logging

### Frontend Architecture
- **UI Framework**: Bootstrap 5 for responsive design with custom CSS theming
- **Visualization**: Chart.js integration for real-time data visualization and metrics display
- **Interactivity**: JavaScript dashboard class managing data fetching, UI updates, chart lifecycle, and site selection
- **Site Management**: Dynamic site switching with separate buttons for Germany and UK manufacturing facilities
- **Styling**: Custom CSS with CSS variables for consistent theming and light mode factory dashboard with white-based cards for improved readability
- **Localization**: Currency formatting and site-specific display adaptations

### Data Management
- **Mock Data Generation**: Random data generation for sensor readings (temperature, pressure, humidity, vibration) with realistic ranges and status indicators
- **Multi-Site Support**: Site-specific data variations for Germany and UK manufacturing facilities with different operational parameters, currencies (EUR/GBP), and performance metrics
- **Real-time Updates**: Auto-refresh mechanism with configurable time intervals and manual refresh capabilities
- **Data Structure**: Structured JSON responses with success/error states, timestamps, and hierarchical data organization
- **Site Selection**: Dynamic site switching with immediate data refresh and localized display formats

### Cross-Origin Resource Sharing
- **CORS Configuration**: Flask-CORS enabled for API endpoints to support potential frontend separation or mobile app integration

## External Dependencies

### Python Packages
- **Flask**: Core web framework for routing and request handling
- **Flask-CORS**: Cross-origin resource sharing support for API endpoints

### Frontend Libraries
- **Bootstrap 5**: CSS framework for responsive UI components and grid system
- **Font Awesome 6.4.0**: Icon library for dashboard visual elements
- **Chart.js**: JavaScript charting library for data visualization

### Development Tools
- **Python Logging**: Built-in logging module for debugging and monitoring
- **Environment Variables**: OS environment variable support for configuration management
