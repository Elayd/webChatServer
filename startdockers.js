const { exec } = require("child_process");
const path = require("path");

const projects = [
  { name: "bff", command: "docker compose up" },
  { name: "AuthService", command: "docker compose up" },
  { name: "UserService", command: "docker compose up" },
];

let processes = [];

function runCommand(command, projectPath) {
  return new Promise((resolve, reject) => {
    console.log(`Запуск команды: "${command}" в папке: ${projectPath}`);
    const process = exec(command, { cwd: projectPath });

    processes.push(process);

    process.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    process.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    process.on("close", (code) => {
      if (code === 0 || code === 130) {
        resolve();
      } else {
        reject(`Процесс завершился с кодом ${code} в папке: ${projectPath}`);
      }
    });
  });
}

async function run() {
  const promises = projects.map((project) => {
    const projectPath = path.join(__dirname, project.name);
    return runCommand(project.command, projectPath);
  });

  try {
    await Promise.all(promises);
    console.log("Все проекты успешно запущены.");
  } catch (err) {
    console.log(err, "err");
    console.error("Ошибка:", err);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("\nПолучен сигнал остановки. Останавливаем все контейнеры...");

  for (let proc of processes) {
    proc.kill();
  }

  try {
    const stopPromises = projects.map((project) => {
      const projectPath = path.join(__dirname, project.name);
      return runCommand("docker compose stop", projectPath);
    });

    await Promise.all(stopPromises);
    console.log("Все контейнеры остановлены.");
    process.exit(0);
  } catch (err) {
    console.error("Ошибка при остановке контейнеров:", err);
    process.exit(1);
  }
});

run();
