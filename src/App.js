import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('addUser'); // Changed default tab
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });
  const [subscribers, setSubscribers] = useState(() => {
    const storedSubscribers = localStorage.getItem('subscribers');
    return storedSubscribers ? JSON.parse(storedSubscribers) : [];
  }); // New state for subscribers
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubscribers, setShowSubscribers] = useState(false);
  const [currentSubscribers, setCurrentSubscribers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form data for Add User
  const [userFormData, setUserFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Form data for Add Subscriber
  const [subscriberFormData, setSubscriberFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    referredBy: ''
  });

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubscriberInputChange = (e) => {
    const { name, value } = e.target;
    setSubscriberFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserRegister = (e) => {
    e.preventDefault();
    if (userFormData.password !== userFormData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Find the max referral number among users and subscribers
    const allReferralIds = [
      ...users.map(u => parseInt(u.referralId.replace('REF', ''))),
      ...subscribers.map(s => parseInt(s.referralId.replace('REF', '')))
    ];
    const nextSerial = allReferralIds.length > 0 ? Math.max(...allReferralIds) + 1 : 1;
    const referralId = `REF${String(nextSerial).padStart(4, '0')}`;

    const newUser = {
      id: Date.now(),
      username: userFormData.username,
      referralId,
      phone: userFormData.phone,
      email: userFormData.email,
      password: userFormData.password,
      role: 'user'
    };

    setUsers([...users, newUser]);
    setUserFormData({
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setSuccessMessage('User registered successfully!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleSubscriberRegister = (e) => {
    e.preventDefault();
    if (subscriberFormData.password !== subscriberFormData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Find the max referral number among users and subscribers
    const allReferralIds = [
      ...users.map(u => parseInt(u.referralId.replace('REF', ''))),
      ...subscribers.map(s => parseInt(s.referralId.replace('REF', '')))
    ];
    const nextSerial = allReferralIds.length > 0 ? Math.max(...allReferralIds) + 1 : 1;
    const referralId = `REF${String(nextSerial).padStart(4, '0')}`;

    const newSubscriber = {
      id: Date.now(),
      username: subscriberFormData.username,
      referralId,
      phone: subscriberFormData.phone,
      email: subscriberFormData.email,
      password: subscriberFormData.password,
      referredBy: subscriberFormData.referredBy,
      role: 'subscriber'
    };

    setSubscribers([...subscribers, newSubscriber]);
    setSubscriberFormData({
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      referredBy: ''
    });
    setSuccessMessage('Subscriber registered successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const deleteSubscriber = (id) => {
    if (window.confirm("Are you sure you want to delete this subscriber?")) {
      setSubscribers(subscribers.filter(subscriber => subscriber.id !== id));
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.referralId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSubscribers = subscribers.filter(subscriber => 
    subscriber.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    subscriber.referralId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subscribersWithReferrers = filteredSubscribers.map(subscriber => {
    const referrer = users.find(user => user.referralId === subscriber.referredBy);
    return { ...subscriber, referrerName: referrer ? referrer.username : 'N/A' };
  }); 

  const viewSubscriberDetails = (referralId) => {
    const subscribersList = subscribers.filter(subscriber => subscriber.referredBy === referralId);
    setCurrentSubscribers(subscribersList);
    setShowSubscribers(true);
  };

  // Load users and subscribers from localStorage on mount
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const storedSubscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
    setUsers(storedUsers);
    setSubscribers(storedSubscribers);
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Save subscribers to localStorage whenever subscribers change
  useEffect(() => {
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  return (
    <div className="dashboard">
      <div className="header-banner">
        <svg
          className="header-svg"
          width="100%"
          height="120"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="bannerGradient" x1="0" y1="0" x2="1440" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0e53b3" />
              <stop offset="1" stopColor="#058baa" />
            </linearGradient>
          </defs>
          <path
            d="M0,40 Q360,120 720,40 T1440,40 V120 H0 Z"
            fill="url(#bannerGradient)"
            opacity="0.3"
          />
          {/* Decorative stars */}
          <polygon points="220,60 228,80 250,80 232,92 240,112 220,100 200,112 208,92 190,80 212,80" fill="#fff" opacity="0.13"/>
          <polygon points="320,30 326,44 342,44 329,53 335,67 320,58 305,67 311,53 298,44 314,44" fill="#fff" opacity="0.10"/>
          <polygon points="600,80 606,92 620,92 610,100 615,112 600,104 585,112 590,100 580,92 594,92" fill="#fff" opacity="0.12"/>
          <polygon points="1100,50 1106,62 1120,62 1110,70 1115,82 1100,74 1085,82 1090,70 1080,62 1094,62" fill="#fff" opacity="0.11"/>
          <polygon points="400,100 406,112 420,112 410,120 415,132 400,124 385,132 390,120 380,112 394,112" fill="#fff" opacity="0.09"/>
          <polygon points="1300,80 1306,92 1320,92 1310,100 1315,112 1300,104 1285,112 1290,100 1280,92 1294,92" fill="#fff" opacity="0.10"/>
          <polygon points="100,40 106,52 120,52 110,60 115,72 100,64 85,72 90,60 80,52 94,52" fill="#fff" opacity="0.08"/>
          <polygon points="700,30 706,42 720,42 710,50 715,62 700,54 685,62 690,50 680,42 694,42" fill="#fff" opacity="0.09"/>
          <polygon points="900,100 906,112 920,112 910,120 915,132 900,124 885,132 890,120 880,112 894,112" fill="#fff" opacity="0.10"/>
          <polygon points="1200,20 1206,32 1220,32 1210,40 1215,52 1200,44 1185,52 1190,40 1180,32 1194,32" fill="#fff" opacity="0.08"/>
          <polygon points="1350,60 1356,72 1370,72 1360,80 1365,92 1350,84 1335,92 1340,80 1330,72 1344,72" fill="#fff" opacity="0.09"/>
          <polygon points="500,20 506,32 520,32 510,40 515,52 500,44 485,52 490,40 480,32 494,32" fill="#fff" opacity="0.07"/>
          <polygon points="200,20 204,28 212,28 206,34 208,42 200,38 192,42 194,34 188,28 196,28" fill="#fff" opacity="0.12"/>
          <polygon points="1250,100 1254,108 1262,108 1256,114 1258,122 1250,118 1242,122 1244,114 1238,108 1246,108" fill="#fff" opacity="0.10"/>
          <polygon points="800,60 804,68 812,68 806,74 808,82 800,78 792,82 794,74 788,68 796,68" fill="#fff" opacity="0.13"/>
          <polygon points="1050,30 1054,38 1062,38 1056,44 1058,52 1050,48 1042,52 1044,44 1038,38 1046,38" fill="#fff" opacity="0.11"/>
          <polygon points="300,90 304,98 312,98 306,104 308,112 300,108 292,112 294,104 288,98 296,98" fill="#fff" opacity="0.09"/>
          <polygon points="1400,40 1404,48 1412,48 1406,54 1408,62 1400,58 1392,62 1394,54 1388,48 1396,48" fill="#fff" opacity="0.08"/>
          <polygon points="100,100 104,108 112,108 106,114 108,122 100,118 92,122 94,114 88,108 96,108" fill="#fff" opacity="0.07"/>
          <polygon points="600,20 604,28 612,28 606,34 608,42 600,38 592,42 594,34 588,28 596,28" fill="#fff" opacity="0.09"/>
          <polygon points="800,100 804,108 812,108 806,114 808,122 800,118 792,122 794,114 788,108 796,108" fill="#fff" opacity="0.08"/>
          <polygon points="1450,100 1454,108 1462,108 1456,114 1458,122 1450,118 1442,122 1444,114 1438,108 1446,108" fill="#fff" opacity="0.10"/>
          <polygon points="300,30 304,38 312,38 306,44 308,52 300,48 292,52 294,44 288,38 296,38" fill="#fff" opacity="0.11"/>
          <polygon points="1000,80 1004,88 1012,88 1006,94 1008,102 1000,98 992,102 994,94 988,88 996,88" fill="#fff" opacity="0.09"/>
          <polygon points="400,60 404,68 412,68 406,74 408,82 400,78 392,82 394,74 388,68 396,68" fill="#fff" opacity="0.08"/>
          <polygon points="1200,90 1204,98 1212,98 1206,104 1208,112 1200,108 1192,112 1194,104 1188,98 1196,98" fill="#fff" opacity="0.12"/>
          <polygon points="50,70 54,78 62,78 56,84 58,92 50,88 42,92 44,84 38,78 46,78" fill="#fff" opacity="0.10"/>
          <polygon points="1150,30 1154,38 1162,38 1156,44 1158,52 1150,48 1142,52 1144,44 1138,38 1146,38" fill="#fff" opacity="0.09"/>
          <polygon points="350,60 354,68 362,68 356,74 358,82 350,78 342,82 344,74 338,68 346,68" fill="#fff" opacity="0.11"/>
          <polygon points="1250,40 1254,48 1262,48 1256,54 1258,62 1250,58 1242,62 1244,54 1238,48 1246,48" fill="#fff" opacity="0.08"/>
          <polygon points="700,110 704,118 712,118 706,124 708,132 700,128 692,132 694,124 688,118 696,118" fill="#fff" opacity="0.12"/>
          <polygon points="900,20 904,28 912,28 906,34 908,42 900,38 892,42 894,34 888,28 896,28" fill="#fff" opacity="0.10"/>
          <polygon points="1400,110 1404,118 1412,118 1406,124 1408,132 1400,128 1392,132 1394,124 1388,118 1396,118" fill="#fff" opacity="0.09"/>
          <polygon points="1150,90 1154,98 1162,98 1156,104 1158,112 1150,108 1142,112 1144,104 1138,98 1146,98" fill="#fff" opacity="0.13"/>
          <polygon points="250,50 254,58 262,58 256,64 258,72 250,68 242,72 244,64 238,58 246,58" fill="#fff" opacity="0.08"/>
          <polygon points="400,10 404,18 412,18 406,24 408,32 400,28 392,32 394,24 388,18 396,18" fill="#fff" opacity="0.12"/>
          </svg>
        <div className="header-content">
          <h1><i className="fas fa-users"></i> User Management Dashboard</h1>
          <p>Manage your users and subscribers with ease and efficiency</p>
        </div>
      </div>
      
      <div className="nav-tabs">
        <button 
          className={`tab-button ${activeTab === 'addUser' ? 'active' : ''}`}
          onClick={() => setActiveTab('addUser')}
        >
          <i className="fas fa-user-plus"></i> Add User
        </button>
        <button 
          className={`tab-button ${activeTab === 'addSubscriber' ? 'active' : ''}`}
          onClick={() => setActiveTab('addSubscriber')}
        >
          <i className="fas fa-user-plus"></i> Add Subscriber
        </button>
        <button 
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          <i className="fas fa-users"></i> View List
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'addUser' ? (
          <div className="add-user-form">
            <h2><i className="fas fa-user-edit"></i> Add User</h2>
            <form onSubmit={handleUserRegister}>
              <div className="form-group">
                <label htmlFor="username"><i className="fas fa-user"></i> Username</label>
                <i className="fas fa-user form-icon"></i>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Enter Your Name"
                  value={userFormData.username}
                  onChange={handleUserInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone"><i className="fas fa-phone"></i> Phone Number</label>
                <i className="fas fa-phone form-icon"></i>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="Enter Phone Number"
                  value={userFormData.phone}
                  onChange={handleUserInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email"><i className="fas fa-envelope"></i> Email ID</label>
                <i className="fas fa-envelope form-icon"></i>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter Email ID"
                  value={userFormData.email}
                  onChange={handleUserInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
                <i className="fas fa-lock form-icon"></i>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Enter Password"
                  value={userFormData.password}
                  onChange={handleUserInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword"><i className="fas fa-lock"></i> Confirm Password</label>
                <i className="fas fa-lock form-icon"></i>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Confirm Password"
                  value={userFormData.confirmPassword}
                  onChange={handleUserInputChange}
                  required 
                />
              </div>
              <button type="submit" className="register-btn">
                <i className="fas fa-user-plus"></i> Register User
              </button>
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
            </form>
          </div>
        ) : activeTab === 'addSubscriber' ? (
          <div className="add-user-form">
            <h2><i className="fas fa-user-edit"></i> Add Subscriber</h2>
            <form onSubmit={handleSubscriberRegister}>
              <div className="form-group">
                <label htmlFor="username"><i className="fas fa-user"></i> Username</label>
                <i className="fas fa-user form-icon"></i>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Enter Your Name"
                  value={subscriberFormData.username}
                  onChange={handleSubscriberInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone"><i className="fas fa-phone"></i> Phone Number</label>
                <i className="fas fa-phone form-icon"></i>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="Enter Phone Number"
                  value={subscriberFormData.phone}
                  onChange={handleSubscriberInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="email"><i className="fas fa-envelope"></i> Email ID</label>
                <i className="fas fa-envelope form-icon"></i>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Enter Email ID"
                  value={subscriberFormData.email}
                  onChange={handleSubscriberInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="password"><i className="fas fa-lock"></i> Password</label>
                <i className="fas fa-lock form-icon"></i>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Enter Password"
                  value={subscriberFormData.password}
                  onChange={handleSubscriberInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword"><i className="fas fa-lock"></i> Confirm Password</label>
                <i className="fas fa-lock form-icon"></i>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Confirm Password"
                  value={subscriberFormData.confirmPassword}
                  onChange={handleSubscriberInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="referredBy"><i className="fas fa-user-friends"></i> Referral ID</label>
                <i className="fas fa-user-friends form-icon"></i>
                <input 
                  type="text" 
                  id="referredBy" 
                  name="referredBy" 
                  placeholder="Enter Referral ID of the referrer (optional)"
                  value={subscriberFormData.referredBy}
                  onChange={handleSubscriberInputChange}
                />
              </div>
              <button type="submit" className="register-btn">
                <i className="fas fa-user-plus"></i> Register Subscriber
              </button>
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
            </form>
          </div>
        ) : (
          <div className="view-users">
            <h2><i className="fas fa-list"></i> Registered Users ({users.length })</h2>
            <div className="search-bar">
              <i className="fas fa-search search-icon"></i>
              <input 
                type="text" 
                placeholder="Search by username or referral ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <table className="users-table">
              <thead>
                <tr>
                  <th><i className="fas fa-id-card"></i> Referral ID</th>
                  <th><i className="fas fa-user"></i> Username</th>
                  <th><i className="fas fa-phone"></i> Phone</th>
                  <th><i className="fas fa-envelope"></i> Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  <>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>
                          <span
                            className="referral-link"
                            style={{ color: "#0e53b3", cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => viewSubscriberDetails(user.referralId)}
                            title="View subscribers"
                          >
                            {user.referralId}
                          </span>
                        </td>
                        <td>{user.username}</td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>
                          <button 
                            onClick={() => deleteUser(user.id)}
                            className="icon-button"
                            title="Delete user"
                          >
                            <i className="fas fa-trash-alt" style={{color: '#ff6b6b'}}></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <i className="fas fa-user-slash"></i>
                      <p>No users found. Add a new user to get started.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subscribers Modal */}
      {showSubscribers && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h3>
          <i className="fas fa-users"></i> Subscriber Details
        </h3>
        <button 
          className="close-modal"
          onClick={() => setShowSubscribers(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      <div className="modal-body">
        {currentSubscribers.length > 0 ? (
          <>
            <div className="referral-title">
              <i className="fas fa-id-card"></i> Users Referral ID:
            <div className="referral-id">{currentSubscribers[0]?.referredBy || 'N/A'}
            </div>
            </div>
            <div className="subscriber-count">
              <i className="fas fa-user-friends"></i> Total Subscribers: {currentSubscribers.length}
            </div>
            
            <div className="subscriber-list">
              {currentSubscribers.map((subscriber, index) => (
                <div key={subscriber.id} className="subscriber-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="subscriber-info">
                    <div className="subscriber-name">
                      <i className="fas fa-user"></i> {subscriber.username}
                    </div>
                    <div className="subscriber-email">
                      <i className="fas fa-envelope"></i> {subscriber.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="no-subscribers">
            <i className="fas fa-user-slash" style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ccc' }}></i>
            <p>No subscribers found for this referral ID.</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </div>
  );
}


export default App;