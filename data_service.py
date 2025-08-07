import random
import time
from datetime import datetime, timedelta
import logging

class DataService:
    """Service class to provide mock data for the factory dashboard"""
    
    def __init__(self):
        self.start_time = datetime.now()
        self.sites = {
            'germany': {
                'name': 'Germany Manufacturing',
                'timezone': 'Europe/Berlin',
                'currency': 'EUR',
                'location_prefix': 'DE-'
            },
            'uk': {
                'name': 'UK Manufacturing',
                'timezone': 'Europe/London', 
                'currency': 'GBP',
                'location_prefix': 'UK-'
            }
        }
        logging.info("DataService initialized")
    
    def get_current_timestamp(self):
        """Get current timestamp in ISO format"""
        return datetime.now().isoformat()
    
    def get_sensor_data(self, site='germany'):
        """Generate mock sensor data for specific site"""
        site_info = self.sites.get(site, self.sites['germany'])
        location_prefix = site_info['location_prefix']
        
        # Site-specific variations
        temp_range = (15.0, 30.0) if site == 'uk' else (20.0, 35.0)
        pressure_range = (8.0, 45.0) if site == 'uk' else (12.0, 50.0)
        
        return {
            'temperature': {
                'value': round(random.uniform(*temp_range), 1),
                'unit': '°C',
                'status': random.choice(['normal', 'warning', 'critical']),
                'location': f'{location_prefix}Production Floor A'
            },
            'pressure': {
                'value': round(random.uniform(*pressure_range), 2),
                'unit': 'bar',
                'status': random.choice(['normal', 'warning']),
                'location': f'{location_prefix}Hydraulic System'
            },
            'humidity': {
                'value': round(random.uniform(25.0 if site == 'uk' else 35.0, 75.0 if site == 'uk' else 65.0), 1),
                'unit': '%',
                'status': 'normal',
                'location': f'{location_prefix}Climate Control'
            },
            'vibration': {
                'value': round(random.uniform(0.1, 2.8 if site == 'germany' else 2.2), 2),
                'unit': 'mm/s',
                'status': random.choice(['normal', 'warning']),
                'location': f'{location_prefix}Motor Assembly'
            }
        }
    
    def get_mes_data(self, site='germany'):
        """Generate mock MES (Manufacturing Execution System) data for specific site"""
        site_info = self.sites.get(site, self.sites['germany'])
        location_prefix = site_info['location_prefix']
        
        # Site-specific performance variations
        oee_base = 85.0 if site == 'germany' else 82.0
        quality_base = 97.0 if site == 'germany' else 95.5
        
        return {
            'overall_equipment_effectiveness': {
                'oee': round(random.uniform(oee_base - 10, oee_base + 10), 1),
                'availability': round(random.uniform(85.0, 98.0), 1),
                'performance': round(random.uniform(80.0, 95.0), 1),
                'quality': round(random.uniform(quality_base - 5, quality_base + 2.5), 1)
            },
            'production_lines': [
                {
                    'id': f'{location_prefix}LINE_001',
                    'name': f'{location_prefix}Assembly Line 1',
                    'status': random.choice(['running', 'idle', 'maintenance']),
                    'efficiency': round(random.uniform(80.0, 98.0), 1),
                    'output_rate': random.randint(45 if site == 'germany' else 40, 65 if site == 'germany' else 60),
                    'target_rate': 60 if site == 'germany' else 55
                },
                {
                    'id': f'{location_prefix}LINE_002',
                    'name': f'{location_prefix}Assembly Line 2',
                    'status': random.choice(['running', 'idle', 'maintenance']),
                    'efficiency': round(random.uniform(80.0, 98.0), 1),
                    'output_rate': random.randint(40 if site == 'germany' else 35, 55 if site == 'germany' else 50),
                    'target_rate': 50 if site == 'germany' else 45
                },
                {
                    'id': f'{location_prefix}LINE_003',
                    'name': f'{location_prefix}Packaging Line',
                    'status': random.choice(['running', 'idle']),
                    'efficiency': round(random.uniform(85.0, 99.0), 1),
                    'output_rate': random.randint(80 if site == 'germany' else 75, 120 if site == 'germany' else 110),
                    'target_rate': 100 if site == 'germany' else 95
                },
                {
                    'id': f'{location_prefix}LINE_004',
                    'name': f'{location_prefix}Quality Control',
                    'status': random.choice(['running', 'idle', 'maintenance']),
                    'efficiency': round(random.uniform(88.0, 99.5), 1),
                    'output_rate': random.randint(35 if site == 'germany' else 30, 50 if site == 'germany' else 45),
                    'target_rate': 45 if site == 'germany' else 40
                },
                {
                    'id': f'{location_prefix}LINE_005',
                    'name': f'{location_prefix}Testing Line',
                    'status': random.choice(['running', 'idle']),
                    'efficiency': round(random.uniform(82.0, 96.0), 1),
                    'output_rate': random.randint(25 if site == 'germany' else 20, 40 if site == 'germany' else 35),
                    'target_rate': 35 if site == 'germany' else 30
                },
                {
                    'id': f'{location_prefix}LINE_006',
                    'name': f'{location_prefix}Finishing Line',
                    'status': random.choice(['running', 'idle', 'maintenance']),
                    'efficiency': round(random.uniform(80.0, 95.0), 1),
                    'output_rate': random.randint(60 if site == 'germany' else 55, 85 if site == 'germany' else 80),
                    'target_rate': 75 if site == 'germany' else 70
                }
            ],
            'quality_metrics': {
                'defect_rate': round(random.uniform(0.1, 2.5 if site == 'uk' else 2.0), 2),
                'first_pass_yield': round(random.uniform(quality_base - 2, quality_base + 2.8), 1),
                'rework_rate': round(random.uniform(0.5, 3.0 if site == 'uk' else 2.5), 2)
            }
        }
    
    def get_erp_data(self, site='germany'):
        """Generate mock ERP (Enterprise Resource Planning) data for specific site"""
        site_info = self.sites.get(site, self.sites['germany'])
        currency = site_info['currency']
        
        # Site-specific financial multipliers
        revenue_multiplier = 1.0 if site == 'germany' else 0.85  # GBP typically lower numbers
        cost_multiplier = 1.0 if site == 'germany' else 0.88
        
        # Site-specific inventory variations
        inventory_multiplier = 1.2 if site == 'germany' else 1.0
        
        return {
            'inventory': {
                'raw_materials': {
                    'steel_sheets': {
                        'current_stock': random.randint(int(150 * inventory_multiplier), int(500 * inventory_multiplier)),
                        'minimum_stock': int(200 * inventory_multiplier),
                        'unit': 'sheets',
                        'status': 'adequate'
                    },
                    'aluminum_bars': {
                        'current_stock': random.randint(int(50 * inventory_multiplier), int(200 * inventory_multiplier)),
                        'minimum_stock': int(100 * inventory_multiplier),
                        'unit': 'bars',
                        'status': random.choice(['low', 'adequate'])
                    },
                    'electronic_components': {
                        'current_stock': random.randint(int(800 * inventory_multiplier), int(2000 * inventory_multiplier)),
                        'minimum_stock': int(1000 * inventory_multiplier),
                        'unit': 'pieces',
                        'status': 'adequate'
                    }
                },
                'finished_goods': {
                    'product_a': random.randint(int(50 * inventory_multiplier), int(200 * inventory_multiplier)),
                    'product_b': random.randint(int(30 * inventory_multiplier), int(150 * inventory_multiplier)),
                    'product_c': random.randint(int(25 * inventory_multiplier), int(100 * inventory_multiplier))
                }
            },
            'financial_metrics': {
                'daily_revenue': round(random.uniform(45000 * revenue_multiplier, 85000 * revenue_multiplier), 2),
                'production_cost': round(random.uniform(25000 * cost_multiplier, 45000 * cost_multiplier), 2),
                'efficiency_savings': round(random.uniform(2000 * revenue_multiplier, 8000 * revenue_multiplier), 2),
                'target_revenue': int(75000 * revenue_multiplier),
                'currency': currency
            },
            'supply_chain': {
                'supplier_performance': round(random.uniform(85.0 if site == 'uk' else 88.0, 98.0), 1),
                'delivery_delays': random.randint(0, 4 if site == 'uk' else 2),
                'pending_orders': random.randint(5 if site == 'germany' else 8, 25 if site == 'germany' else 30)
            }
        }
    
    def get_work_orders(self, site='germany'):
        """Generate mock work orders data for specific site"""
        site_info = self.sites.get(site, self.sites['germany'])
        location_prefix = site_info['location_prefix']
        
        work_orders = []
        order_statuses = ['in_progress', 'pending', 'completed', 'on_hold']
        
        # Site-specific product variations
        products = ['Product A', 'Product B', 'Product C', 'Product D'] if site == 'germany' else ['Product X', 'Product Y', 'Product Z', 'Product W']
        order_count = 8 if site == 'germany' else 6
        
        for i in range(order_count):
            order_id = f"{location_prefix}WO{2024000 + i + 1}"
            status = random.choice(order_statuses)
            progress = 0
            
            if status == 'completed':
                progress = 100
            elif status == 'in_progress':
                progress = random.randint(10, 90)
            elif status == 'pending':
                progress = 0
            else:  # on_hold
                progress = random.randint(20, 60)
            
            work_orders.append({
                'id': order_id,
                'product': random.choice(products),
                'quantity': random.randint(50 if site == 'germany' else 40, 500 if site == 'germany' else 400),
                'status': status,
                'progress': progress,
                'priority': random.choice(['high', 'medium', 'low']),
                'assigned_line': f"{location_prefix}Line {random.randint(1, 3)}",
                'start_date': (datetime.now() - timedelta(days=random.randint(0, 7))).strftime('%Y-%m-%d'),
                'due_date': (datetime.now() + timedelta(days=random.randint(1, 14))).strftime('%Y-%m-%d')
            })
        
        return work_orders
    
    def get_production_metrics(self, site='germany'):
        """Generate mock production performance metrics for specific site"""
        # Site-specific production targets and variations
        target_base = 1000 if site == 'germany' else 850
        production_variance = 0.15 if site == 'germany' else 0.18  # UK has slightly more variance
        
        return {
            'daily_production': {
                'target': target_base,
                'actual': random.randint(int(target_base * (1 - production_variance)), int(target_base * (1 + production_variance))),
                'efficiency': round(random.uniform(85.0 if site == 'uk' else 88.0, 105.0), 1)
            },
            'weekly_trend': [
                {'day': 'Mon', 'production': random.randint(int(target_base * 0.85), int(target_base * 1.1))},
                {'day': 'Tue', 'production': random.randint(int(target_base * 0.85), int(target_base * 1.1))},
                {'day': 'Wed', 'production': random.randint(int(target_base * 0.85), int(target_base * 1.1))},
                {'day': 'Thu', 'production': random.randint(int(target_base * 0.85), int(target_base * 1.1))},
                {'day': 'Fri', 'production': random.randint(int(target_base * 0.85), int(target_base * 1.1))},
                {'day': 'Sat', 'production': random.randint(int(target_base * 0.6), int(target_base * 0.8))},
                {'day': 'Sun', 'production': random.randint(int(target_base * 0.4), int(target_base * 0.6))}
            ],
            'downtime': {
                'total_minutes': random.randint(30 if site == 'germany' else 45, 180 if site == 'germany' else 210),
                'planned': random.randint(20, 60),
                'unplanned': random.randint(10 if site == 'germany' else 15, 120 if site == 'germany' else 150)
            }
        }
    
    def get_historical_data(self, time_range, site='germany'):
        """Generate mock historical data for charts for specific site"""
        now = datetime.now()
        data_points = []
        
        # Site-specific ranges
        temp_base = (20.0, 30.0) if site == 'germany' else (18.0, 28.0)
        pressure_base = (15.0, 25.0) if site == 'germany' else (12.0, 22.0)
        production_base_min = 50 if site == 'germany' else 45
        production_base_max = 70 if site == 'germany' else 65
        
        if time_range == '1h':
            # Generate data for last hour (every 5 minutes)
            for i in range(12):
                timestamp = now - timedelta(minutes=i*5)
                data_points.append({
                    'timestamp': timestamp.strftime('%H:%M'),
                    'temperature': round(random.uniform(*temp_base), 1),
                    'pressure': round(random.uniform(*pressure_base), 1),
                    'production_rate': random.randint(production_base_min, production_base_max)
                })
        elif time_range == '24h':
            # Generate data for last 24 hours (every hour)
            for i in range(24):
                timestamp = now - timedelta(hours=i)
                data_points.append({
                    'timestamp': timestamp.strftime('%H:00'),
                    'temperature': round(random.uniform(temp_base[0] - 2, temp_base[1] + 2), 1),
                    'pressure': round(random.uniform(pressure_base[0] - 3, pressure_base[1] + 3), 1),
                    'production_rate': random.randint(production_base_min - 10, production_base_max + 10)
                })
        elif time_range == '7d':
            # Generate data for last 7 days (daily)
            for i in range(7):
                timestamp = now - timedelta(days=i)
                data_points.append({
                    'timestamp': timestamp.strftime('%m/%d'),
                    'temperature': round(random.uniform(temp_base[0] - 5, temp_base[1] + 5), 1),
                    'pressure': round(random.uniform(pressure_base[0] - 5, pressure_base[1] + 5), 1),
                    'production_rate': random.randint(production_base_min - 20, production_base_max + 20)
                })
        
        return {
            'time_range': time_range,
            'data_points': list(reversed(data_points))  # Reverse to show oldest first
        }
    
    def get_site_list(self):
        """Get available sites"""
        return self.sites
