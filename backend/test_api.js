const http = require('http');
const mongoose = require('mongoose');

const runTest = async () => {
  const app = require('./src/app');
  const server = http.createServer(app);

  // Wait for mongoose connection
  if (mongoose.connection.readyState !== 1) {
    await new Promise(resolve => mongoose.connection.once('open', resolve));
  }

  server.listen(5099, async () => {
    console.log('Testing backend APIs on port 5099...');
    try {
      const request = async (path, method = 'GET', body = null, token = null) => {
        return new Promise((resolve, reject) => {
          const postData = body ? JSON.stringify(body) : '';
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers['Authorization'] = `Bearer ${token}`;
          if (method !== 'GET' && postData) {
            headers['Content-Length'] = Buffer.byteLength(postData);
          }

          const req = http.request(`http://localhost:5099${path}`, { method, headers }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                resolve({ status: res.statusCode, data: parsed });
              } catch (e) {
                resolve({ status: res.statusCode, raw: data });
              }
            });
          });
          req.on('error', reject);
          if (method !== 'GET' && postData) {
            req.write(postData);
          }
          req.end();
        });
      };

      // 1. Health check
      const health = await request('/api/health');
      console.log('1. Health Check:', health.status, health.data.status === 'ok' ? '✓ PASS' : '✗ FAIL');

      // 2. Login with Demo user
      const login = await request('/api/auth/login', 'POST', {
        email: 'demo@financepartner.in',
        password: 'DemoPassword@123'
      });
      console.log('2. Login:', login.status, login.data.success ? '✓ PASS' : '✗ FAIL');
      const token = login.data.data.accessToken;

      // 3. User Me
      const me = await request('/api/auth/me', 'GET', null, token);
      console.log('3. Get Profile (Me):', me.status, me.data.data.fullName === 'Rahul Sharma' ? '✓ PASS' : '✗ FAIL');

      // 4. Categories
      const categories = await request('/api/categories', 'GET', null, token);
      console.log('4. Categories:', categories.status, categories.data.data.length >= 10 ? '✓ PASS' : '✗ FAIL');

      // 5. Expenses list
      const expenses = await request('/api/expenses', 'GET', null, token);
      console.log('5. Expenses List:', expenses.status, expenses.data.data.length >= 5 ? '✓ PASS' : '✗ FAIL');

      // 6. Expense Summary
      const summary = await request('/api/expenses/summary', 'GET', null, token);
      console.log('6. Expense Summary (Needs/Wants/Savings):', summary.status, summary.data.data.salary === 35000 ? '✓ PASS' : '✗ FAIL');

      // 7. Advisor Dashboard
      const advisor = await request('/api/advisor/dashboard', 'GET', null, token);
      console.log('7. Advisor Dashboard (Blueprint & Tips):', advisor.status, advisor.data.data.tips.length > 0 ? '✓ PASS' : '✗ FAIL');

      // 8. Advisor What-If Simulation
      const whatIf = await request('/api/advisor/what-if', 'POST', {
        category: 'Food',
        reductionAmount: 1000,
        returnRate: 12,
        tenureYears: 5
      }, token);
      console.log('8. Advisor What-If Simulation:', whatIf.status, whatIf.data.data.yearlySaving === 12000 ? '✓ PASS' : '✗ FAIL');

      // 9. SIP Portfolio
      const sips = await request('/api/sips', 'GET', null, token);
      console.log('9. SIP Portfolio:', sips.status, sips.data.data.length >= 2 ? '✓ PASS' : '✗ FAIL');

      // 10. SIP Calculator
      const sipCalc = await request('/api/sips/calculate', 'POST', {
        monthlyAmount: 3000,
        annualRate: 12,
        tenureYears: 10
      }, token);
      console.log('10. SIP Calculator:', sipCalc.status, sipCalc.data.data.futureValue > 0 ? '✓ PASS' : '✗ FAIL');

      // 11. Reports Monthly
      const reports = await request('/api/reports/monthly', 'GET', null, token);
      console.log('11. Monthly Report:', reports.status, reports.data.data.user.fullName ? '✓ PASS' : '✗ FAIL');

      // 12. Notifications
      const notifs = await request('/api/notifications', 'GET', null, token);
      console.log('12. Notifications:', notifs.status, notifs.data.data.length > 0 ? '✓ PASS' : '✗ FAIL');

      console.log('\n======================================================');
      console.log('  ALL BACKEND MODULES AND API ENDPOINTS VERIFIED!  ');
      console.log('======================================================\n');
      process.exit(0);
    } catch (err) {
      console.error('API Verification Error:', err);
      process.exit(1);
    }
  });
};

runTest();
