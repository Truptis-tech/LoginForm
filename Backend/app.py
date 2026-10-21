import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)  # Allow React frontend (port 3001) to talk to Flask (port 5000)

# ─────────────────────────────────────────────
# DATABASE CONFIGURATION
# Priority: MySQL (if DATABASE_URL set in .env) → SQLite (auto fallback)
# ─────────────────────────────────────────────
MYSQL_URL = os.environ.get('DATABASE_URL')

if MYSQL_URL:
    # Using MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = MYSQL_URL
    DB_TYPE = 'MySQL'
    DB_INFO = MYSQL_URL.split('@')[-1] if '@' in MYSQL_URL else MYSQL_URL
else:
    # Using SQLite (local file, no installation needed)
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'users.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    DB_TYPE = 'SQLite'
    DB_INFO = db_path

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# ─────────────────────────────────────────────
# USER MODEL (maps to 'users' table in DB)
# ─────────────────────────────────────────────
class User(db.Model):
    __tablename__ = 'users'

    id       = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name     = db.Column(db.String(100), nullable=False)
    email    = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role     = db.Column(db.String(50),  default='Viewer')
    status   = db.Column(db.String(50),  default='Pending')
    joined   = db.Column(db.String(50),  nullable=False)
    avatar   = db.Column(db.String(10),  nullable=False)
    dept     = db.Column(db.String(100), default='Engineering')

    def to_dict(self):
        return {
            'id':     self.id,
            'name':   self.name,
            'email':  self.email,
            'role':   self.role,
            'status': self.status,
            'joined': self.joined,
            'avatar': self.avatar,
            'dept':   self.dept
        }


def get_initials(name):
    parts = name.split()
    return ''.join([p[0] for p in parts if p])[:2].upper() or '?'


# ─────────────────────────────────────────────
# CREATE TABLES + SEED DEFAULT USERS
# ─────────────────────────────────────────────
SEED_USERS = [
    {'name': 'Trupti Lakshmi', 'email': 'truptilakshmi.tm@gmail.com', 'password': 'trupti@2005',  'role': 'Super Admin', 'status': 'Active',   'joined': '2026-06-06', 'avatar': 'TL', 'dept': 'Leadership'},
    {'name': 'Alice Johnson',  'email': 'alice@gmail.com',            'password': 'password123',  'role': 'Super Admin', 'status': 'Active',   'joined': '2024-01-10', 'avatar': 'AJ', 'dept': 'Engineering'},
    {'name': 'Bob Martinez',   'email': 'bob@yahoo.com',              'password': 'password123',  'role': 'Editor',      'status': 'Active',   'joined': '2024-02-14', 'avatar': 'BM', 'dept': 'Marketing'},
    {'name': 'Carol Smith',    'email': 'carol@gmail.com',            'password': 'password123',  'role': 'Viewer',      'status': 'Inactive', 'joined': '2024-03-05', 'avatar': 'CS', 'dept': 'Sales'},
    {'name': 'David Lee',      'email': 'david@yahoo.com',            'password': 'password123',  'role': 'Editor',      'status': 'Active',   'joined': '2024-04-22', 'avatar': 'DL', 'dept': 'Design'},
    {'name': 'Emma Wilson',    'email': 'emma@gmail.com',             'password': 'password123',  'role': 'Viewer',      'status': 'Pending',  'joined': '2024-05-18', 'avatar': 'EW', 'dept': 'HR'},
    {'name': 'Frank Brown',    'email': 'frank@yahoo.com',            'password': 'password123',  'role': 'Editor',      'status': 'Active',   'joined': '2024-06-01', 'avatar': 'FB', 'dept': 'Finance'},
    {'name': 'Grace Davis',    'email': 'grace@gmail.com',            'password': 'password123',  'role': 'Viewer',      'status': 'Inactive', 'joined': '2024-07-09', 'avatar': 'GD', 'dept': 'Engineering'},
    {'name': 'Henry Taylor',   'email': 'henry@yahoo.com',            'password': 'password123',  'role': 'Super Admin', 'status': 'Active',   'joined': '2024-08-15', 'avatar': 'HT', 'dept': 'Leadership'},
]


def init_database():
    with app.app_context():
        db.create_all()  # Creates tables if they don't exist

        # Upsert seed users: ensure canonical test users always exist with correct data
        for u in SEED_USERS:
            existing = User.query.filter(User.email.ilike(u['email'])).first()
            if existing:
                # Update password/role/status to match seed (keeps DB consistent)
                existing.password = u['password']
                existing.role     = u['role']
                existing.status   = u['status']
                existing.dept     = u['dept']
                existing.avatar   = u['avatar']
            else:
                db.session.add(User(**u))
        db.session.commit()
        print(f"  >> Database initialised with {len(SEED_USERS)} seed users.")


init_database()


# ═══════════════════════════════════════════════════════════
#  API ROUTES
# ═══════════════════════════════════════════════════════════

# ── Health / Root ──────────────────────────────────────────
@app.route('/')
def index():
    """Root route - shows API info"""
    return jsonify({
        'app':     'AdminPortal Backend API',
        'status':  'running',
        'db_type': DB_TYPE,
        'db':      DB_INFO,
        'endpoints': {
            'GET  /health':                'Health check',
            'POST /api/auth/login':        'User login',
            'POST /api/auth/register':     'User registration',
            'GET  /api/users':             'List all users',
            'POST /api/users':             'Create user',
            'PUT  /api/users/<id>':        'Update user',
            'DELETE /api/users/<id>':      'Delete user',
            'POST /api/users/bulk-delete': 'Bulk delete users',
        }
    })


@app.route('/health')
def health():
    """Health check endpoint"""
    try:
        user_count = User.query.count()
        return jsonify({
            'status':     'ok',
            'database':   DB_TYPE,
            'connected':  True,
            'user_count': user_count,
            'message':    f'Backend running. Connected to {DB_TYPE} with {user_count} users.'
        }), 200
    except Exception as e:
        return jsonify({
            'status':    'error',
            'connected': False,
            'message':   str(e)
        }), 500


# ── Authentication ─────────────────────────────────────────
@app.route('/api/auth/login', methods=['POST'])
def login():
    data     = request.get_json() or {}
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'message': 'Email and password are required.'}), 400

    # Find user by email (case-insensitive)
    user = User.query.filter(User.email.ilike(email)).first()

    if not user:
        return jsonify({'message': 'Invalid credentials. Please verify your email and password.'}), 401

    # Check account status BEFORE checking password
    if user.status == 'Pending':
        return jsonify({'message': 'Your registration is pending admin approval. Access is not granted yet.'}), 403
    if user.status == 'Inactive':
        return jsonify({'message': 'Your account is deactivated. Please contact the administrator.'}), 403

    if user.password != password:
        return jsonify({'message': 'Invalid credentials. Please verify your email and password.'}), 401

    return jsonify(user.to_dict()), 200


@app.route('/api/auth/register', methods=['POST'])
def register():
    data     = request.get_json() or {}
    name     = data.get('name', '').strip()
    email    = data.get('email', '').strip().lower()
    password = data.get('password', '')
    dept     = data.get('dept', 'Engineering')

    if not name or not email or not password:
        return jsonify({'message': 'Name, email and password are required.'}), 400

    if len(password) < 6:
        return jsonify({'message': 'Password must be at least 6 characters.'}), 400

    if User.query.filter(User.email.ilike(email)).first():
        return jsonify({'message': 'This email is already registered.'}), 400

    new_user = User(
        name=name, email=email, password=password,
        role='Viewer', status='Pending', dept=dept,
        joined=datetime.now().strftime('%Y-%m-%d'),
        avatar=get_initials(name)
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'message': 'Registration successful. Pending admin approval.',
        'user':    new_user.to_dict()
    }), 201


# ── User CRUD ──────────────────────────────────────────────
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.order_by(User.id.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200


@app.route('/api/users', methods=['POST'])
def create_user():
    data   = request.get_json() or {}
    name   = data.get('name', '').strip()
    email  = data.get('email', '').strip().lower()
    role   = data.get('role', 'Viewer')
    status = data.get('status', 'Active')
    dept   = data.get('dept', 'Engineering')
    pwd    = data.get('password', 'password123')

    if not name or not email:
        return jsonify({'message': 'Name and email are required.'}), 400

    if User.query.filter(User.email.ilike(email)).first():
        return jsonify({'message': 'Email already exists.'}), 400

    user = User(
        name=name, email=email, password=pwd,
        role=role, status=status, dept=dept,
        joined=datetime.now().strftime('%Y-%m-%d'),
        avatar=get_initials(name)
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201


@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found.'}), 404

    data   = request.get_json() or {}
    name   = data.get('name', '').strip()
    email  = data.get('email', '').strip().lower()
    role   = data.get('role')
    status = data.get('status')
    dept   = data.get('dept')

    if name:
        user.name   = name
        user.avatar = get_initials(name)
    if email and email != user.email.lower():
        if User.query.filter(User.email.ilike(email)).first():
            return jsonify({'message': 'Email already exists.'}), 400
        user.email = email
    if role:   user.role   = role
    if status: user.status = status
    if dept:   user.dept   = dept

    db.session.commit()
    return jsonify(user.to_dict()), 200


@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found.'}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully.'}), 200


@app.route('/api/users/bulk-delete', methods=['POST'])
def bulk_delete():
    # silent=True: don't raise 415 if Content-Type header is missing
    data     = request.get_json(silent=True) or {}
    user_ids = data.get('ids', [])
    if not isinstance(user_ids, list) or not user_ids:
        return jsonify({'message': 'No user IDs provided.'}), 400
    count = User.query.filter(User.id.in_(user_ids)).delete(synchronize_session=False)
    db.session.commit()
    return jsonify({'message': f'{count} users deleted.'}), 200


# ─────────────────────────────────────────────
# STARTUP
# ─────────────────────────────────────────────
if __name__ == '__main__':
    port  = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'

    print("\n" + "="*55)
    print("  AdminPortal Backend API")
    print("="*55)
    print(f"  Database  : {DB_TYPE}")
    print(f"  Location  : {DB_INFO}")
    print(f"  API URL   : http://localhost:{port}")
    print(f"  Health    : http://localhost:{port}/health")
    print(f"  Users API : http://localhost:{port}/api/users")
    print("="*55 + "\n")

    app.run(host='0.0.0.0', port=port, debug=debug)
