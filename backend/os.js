// const os = require('os');

// // Basic system information
// console.log(`OS Platform: ${os.platform()}`);
// console.log(`OS Type: ${os.type()}`);
// console.log(`OS Release: ${os.release()}`);
// console.log(`CPU Architecture: ${os.arch()}`);
// console.log(`Hostname: ${os.hostname()}`);

// function memoryInGB (bytes) {
//   return (bytes / (1024 * 1024 * 1024)).toFixed(2);
// }

// // Memory information
// // const totalMemGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
// // const freeMemGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
// const totalMemGB = memoryInGB(os.totalmem());
// const freeMemGB = memoryInGB(os.freemem()); 
// console.log(`Memory: ${freeMemGB}GB free of ${totalMemGB}GB`);

// // User information
// const userInfo = os.userInfo();
// console.log(`Current User: ${userInfo.username}`);
// console.log(`Home Directory: ${os.homedir()}`);





const os = require('os');

// Get CPU information
const cpus = os.cpus();
console.log(`Number of CPU Cores: ${cpus.length}`);

// Display information about each CPU core
cpus.forEach((cpu, index) => {
  console.log(`\nCPU Core ${index + 1}:`);
  console.log(`- Model: ${cpu.model}`);
  console.log(`- Speed: ${cpu.speed} MHz`);
  console.log('- Times (ms):', {     user: cpu.times.user,
    nice: cpu.times.nice,
    sys: cpu.times.sys,
    idle: cpu.times.idle,
    irq: cpu.times.irq
  });
});
// Calculate total CPU usage (example, requires two measurements)
function calculateCpuUsage(prevCpus) {
  const currentCpus = os.cpus();
  const usage = [];

  for (let i = 0; i < currentCpus.length; i++) {
    const current = currentCpus[i];
    const prev = prevCpus ? prevCpus[i] : { times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } };

    const prevIdle = prev.times.idle;
    const idle = current.times.idle - prevIdle;

    let total = 0;
    for (const type in current.times) {
      total += current.times[type] - (prev.times[type] || 0);
    }

    const usagePercent = ((1 - idle / total) * 100).toFixed(1);
    usage.push(parseFloat(usagePercent));
  }

  return {
    perCore: usage,
    average: (usage.reduce((a, b) => a + b, 0) / usage.length).toFixed(1),
    cpus: currentCpus
  };
}

// Example usage of CPU usage calculation
console.log('\nCPU Usage (requires two measurements):');
const firstMeasure = os.cpus();

// Simulate some CPU work
for (let i = 0; i < 1000000000; i++) {}
const usage = calculateCpuUsage(firstMeasure);
console.log(`Average CPU Usage: ${usage.average}%`);