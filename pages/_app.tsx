import React, { useState } from 'react';

// LoginForm Component - สร้างฟอร์มล็อคอิน
const LoginForm: React.FC = () => {
  // สถานะสำหรับเก็บข้อมูลอีเมลและรหัสผ่าน
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ฟังก์ชันสำหรับตรวจสอบความถูกต้องของอีเมล
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // ฟังก์ชันสำหรับจัดการการส่งฟอร์ม
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // เคลียร์ข้อผิดพลาดเดิม
    setError('');
    
    // ตรวจสอบข้อมูล
    if (!email || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }
    
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // จำลองการส่งข้อมูลไปยัง API
      await loginUser(email, password);
      
      // เมื่อล็อคอินสำเร็จ
      setIsLoggedIn(true);
      
    } catch (err) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };
  
  // ฟังก์ชันจำลองการส่งข้อมูลไปยัง API
  const loginUser = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // จำลองการส่งข้อมูลไปยัง API (เปลี่ยนเป็น fetch จริงในการใช้งานจริง)
      setTimeout(() => {
        // ตัวอย่างการตรวจสอบ (ในการใช้งานจริงจะต้องส่งไปตรวจสอบที่ฝั่ง server)
        if (email === 'test@example.com' && password === 'password123') {
          // จำลองการเก็บ token ใน localStorage
          localStorage.setItem('token', 'example-token-123456');
          localStorage.setItem('user', JSON.stringify({ email, name: 'Test User' }));
          resolve();
        } else {
          reject(new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'));
        }
      }, 1000); // จำลองความล่าช้าของเครือข่าย 1 วินาที
    });
  };
  
  // ฟังก์ชันสำหรับออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };
  
  // แสดงหน้าเมื่อล็อคอินสำเร็จ
  if (isLoggedIn) {
    return (
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">ยินดีต้อนรับ!</h2>
        <p className="mb-4">คุณได้เข้าสู่ระบบเรียบร้อยแล้ว</p>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
        >
          ออกจากระบบ
        </button>
      </div>
    );
  }
  
  // แสดงฟอร์มล็อคอิน
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกอีเมลของคุณ"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            รหัสผ่าน
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกรหัสผ่านของคุณ"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded transition duration-200`}
        >
          {isLoading ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
};

// AuthContext - สำหรับการจัดการสถานะการเข้าสู่ระบบทั่วทั้งแอป
interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // ตรวจสอบว่ามีการล็อคอินอยู่แล้วหรือไม่เมื่อโหลดแอป
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data', error);
        logout();
      }
    }
  }, []);
  
  const login = async (email: string, password: string): Promise<void> => {
    // ในการใช้งานจริง จะส่งข้อมูลไปยัง API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password123') {
          const userData: User = { email, name: 'Test User' };
          localStorage.setItem('token', 'example-token-123456');
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          resolve();
        } else {
          reject(new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'));
        }
      }, 1000);
    });
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook สำหรับใช้งาน AuthContext
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ตัวอย่างการใช้งาน
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
        <LoginPage />
      </div>
    </AuthProvider>
  );
};

// หน้า Login
const LoginPage: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
    } catch (err) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isAuthenticated && user) {
    return (
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">ยินดีต้อนรับ {user.name}!</h2>
        <p className="mb-4">คุณได้เข้าสู่ระบบด้วยอีเมล: {user.email}</p>
        <button
          onClick={logout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
        >
          ออกจากระบบ
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            อีเมล
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกอีเมลของคุณ"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            รหัสผ่าน
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="กรอกรหัสผ่านของคุณ"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 ${
            isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          } text-white rounded transition duration-200`}
        >
          {isLoading ? 'กำลังดำเนินการ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
};

export default App;
