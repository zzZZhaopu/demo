import { useState } from 'react';
import { Button, Input } from '@zzzzzzhaopu/react';

function App() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          React UI Library Demo
        </h1>

        {/* Button 演示 */}
        <section className="mb-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Button 组件</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">不同变体</h3>
              <div className="flex gap-4">
                <Button variant="primary" onClick={() => alert('Primary clicked!')}>
                  Primary
                </Button>
                <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
                  Secondary
                </Button>
                <Button variant="danger" onClick={() => alert('Danger clicked!')}>
                  Danger
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">不同尺寸</h3>
              <div className="flex gap-4 items-center">
                <Button size="small">Small</Button>
                <Button size="medium">Medium</Button>
                <Button size="large">Large</Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">禁用状态</h3>
              <div className="flex gap-4">
                <Button disabled>Disabled</Button>
                <Button variant="primary" disabled>Primary Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Input 演示 */}
        <section className="mb-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Input 组件</h2>
          
          <div className="space-y-4 max-w-md">
            <Input
              label="用户名"
              placeholder="请输入用户名"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <Input
              label="邮箱"
              type="email"
              placeholder="请输入邮箱"
              fullWidth
            />

            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              error="密码不能少于6位"
            />

            <div className="pt-4">
              <p className="text-sm text-gray-600">
                当前输入值: <strong>{inputValue || '(空)'}</strong>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
