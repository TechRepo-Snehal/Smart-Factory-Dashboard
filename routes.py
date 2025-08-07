from flask import render_template, jsonify, request
from app import app
from data_service import DataService
import logging

data_service = DataService()

@app.route('/')
def index():
    """Render the main dashboard page"""
    return render_template('index.html')

@app.route('/api/sensor-data')
def get_sensor_data():
    """Get current sensor readings"""
    try:
        site = request.args.get('site', 'germany')
        sensor_data = data_service.get_sensor_data(site)
        return jsonify({
            'success': True,
            'data': sensor_data,
            'timestamp': data_service.get_current_timestamp()
        })
    except Exception as e:
        logging.error(f"Error fetching sensor data: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch sensor data'
        }), 500

@app.route('/api/mes-data')
def get_mes_data():
    """Get Manufacturing Execution System data"""
    try:
        site = request.args.get('site', 'germany')
        mes_data = data_service.get_mes_data(site)
        return jsonify({
            'success': True,
            'data': mes_data,
            'timestamp': data_service.get_current_timestamp()
        })
    except Exception as e:
        logging.error(f"Error fetching MES data: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch MES data'
        }), 500

@app.route('/api/erp-data')
def get_erp_data():
    """Get Enterprise Resource Planning data"""
    try:
        site = request.args.get('site', 'germany')
        erp_data = data_service.get_erp_data(site)
        return jsonify({
            'success': True,
            'data': erp_data,
            'timestamp': data_service.get_current_timestamp()
        })
    except Exception as e:
        logging.error(f"Error fetching ERP data: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch ERP data'
        }), 500

@app.route('/api/work-orders')
def get_work_orders():
    """Get current work orders with progress"""
    try:
        site = request.args.get('site', 'germany')
        work_orders = data_service.get_work_orders(site)
        return jsonify({
            'success': True,
            'data': work_orders,
            'timestamp': data_service.get_current_timestamp()
        })
    except Exception as e:
        logging.error(f"Error fetching work orders: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch work orders'
        }), 500

@app.route('/api/production-metrics')
def get_production_metrics():
    """Get production performance metrics"""
    try:
        site = request.args.get('site', 'germany')
        metrics = data_service.get_production_metrics(site)
        return jsonify({
            'success': True,
            'data': metrics,
            'timestamp': data_service.get_current_timestamp()
        })
    except Exception as e:
        logging.error(f"Error fetching production metrics: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch production metrics'
        }), 500

@app.route('/api/historical-data')
def get_historical_data():
    """Get historical data for charts"""
    try:
        time_range = request.args.get('range', '24h')  # Default to 24 hours
        site = request.args.get('site', 'germany')
        historical_data = data_service.get_historical_data(time_range, site)
        return jsonify({
            'success': True,
            'data': historical_data,
            'timestamp': data_service.get_current_timestamp()
        })
    except Exception as e:
        logging.error(f"Error fetching historical data: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch historical data'
        }), 500

@app.route('/api/sites')
def get_sites():
    """Get available sites"""
    try:
        sites = data_service.get_site_list()
        return jsonify({
            'success': True,
            'data': sites,
            'timestamp': data_service.get_current_timestamp()
        })
    except Exception as e:
        logging.error(f"Error fetching sites: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Failed to fetch sites'
        }), 500
