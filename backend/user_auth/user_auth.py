from flask import Flask, render_template, flash, redirect, url_for, session
from forms import RegisterForm, LoginForm
from models import db, User
from flask_bcrypt import Bcrypt

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'CSE403'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:password@localhost:port/db_name' # Replace with your URI

    bcrypt = Bcrypt()
    bcrypt.init_app(app)

    db.init_app(app)
    with app.app_context():
        db.create_all()


    @app.route('/')
    def home():
        return render_template("home.html")
    
    @app.route('/login', methods = ['GET', 'POST'])
    def login():
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(email=form.email.data).first()
            if user and bcrypt.check_password_hash(user.password, form.password.data):
                session['user_id'] = user.id
                session['username'] = user.username
                flash('You have been logged in!', 'success')
                return redirect(url_for('dashboard'))
            else:
                flash('Login unsuccessful. Please check email and password.', 'failure')
        return render_template("login.html", form=form)
    
    @app.route('/register', methods = ['GET', 'POST'])
    def register():
        if 'user_id' in session:
            return redirect(url_for('dashboard'))
        form = RegisterForm()
        if form.validate_on_submit():
            hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
            user = User(
                username = form.username.data,
                email = form.email.data,
                password = hashed_password
            )
            db.session.add(user)
            db.session.commit()
            flash('Your account has been created!', 'success')
            return redirect(url_for('login'))
        
        return render_template("register.html", form=form)

    @app.route('/dashboard')
    def dashboard():
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return render_template("dashboard.html")

    @app.route('/logout')
    def logout():
        session.pop('user_id')
        session.pop('username')
        flash('You have been logged out!', 'seccess')
        return redirect(url_for('home'))

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5001)
