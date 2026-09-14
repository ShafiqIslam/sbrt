# sbrt

**sbrt** is a terminal UI (TUI) for managing a Spring Boot application during local development.

It runs the Spring Boot application from the current project directory and provides a simple interactive interface for:

- Viewing application logs
- Restarting Spring Boot through Spring DevTools
- Performing a clean restart
- Clearing logs
- Searching logs
- Gracefully stopping the application
- Showing the current application and restart status

`sbrt` is designed to be run directly from a Spring Boot project:

```bash
cd my-spring-project
sbrt
```

The current version is designed for projects using the **Maven Wrapper (`./mvnw`)**.

---

## Installation

Install `sbrt` globally using npm:

```bash
npm install -g sbrt
```

Verify the installation:

```bash
sbrt --version
```

---

## Setup

### 1. Spring Boot DevTools

`sbrt` uses Spring Boot DevTools for application restart.

Make sure your Spring Boot project has the Spring Boot DevTools dependency.

For Maven:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 2. Configure the shared environment variables

`sbrt` and the Spring Boot application use the **same environment variables** to determine the DevTools restart configuration.

Have the following variables in your Spring Boot `.env` file:

```dotenv
SPRING_DEVTOOLS_RESTART_ENABLED=true
SPRING_DEVTOOLS_RESTART_TRIGGER_FILE=.restart.trigger
```

These variables have two consumers:

```text
                    .env
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
        sbrt              Spring Boot
          │               application.yml
          │                     │
          └────  Restart  ──────┘
```

This is important because `sbrt` should display the same restart mode that Spring Boot is configured to use.

### 3. Configure Spring Boot

Reference the same environment variables from `application.yml`:

```yaml
spring:
  devtools:
    restart:
      enabled: ${SPRING_DEVTOOLS_RESTART_ENABLED:false}
      trigger-file: ${SPRING_DEVTOOLS_RESTART_TRIGGER_FILE:}
```

Do not configure different values separately for `sbrt` and Spring Boot. The `.env` values should be the single source of truth for the local development setup.

### 4. Create the trigger file

When using manual restart, create the trigger file in your resources directory:

```bash
touch src/main/resources/.restart.trigger
```

The trigger filename is **user-defined**. `.restart.trigger` is the default filename used in this example, you can change to whatever you like. The filename configured in `SPRING_DEVTOOLS_RESTART_TRIGGER_FILE` env variable must match the actual file.

Add the trigger file to your project's `.gitignore` as the file is only required for local development:

```gitignore
src/main/resources/.restart.trigger
```

---

## Environment Variables

### Manual restart

To use the `r` action in `sbrt`:

```dotenv
SPRING_DEVTOOLS_RESTART_ENABLED=true
SPRING_DEVTOOLS_RESTART_TRIGGER_FILE=.restart.trigger
```

`sbrt` displays:

```text
● MANUAL
```

and provides:

```text
[ r ] Restart
```

Pressing `r` updates the configured trigger file, allowing Spring DevTools to restart the application.

### Automatic restart

If DevTools restart is enabled but no trigger file is configured:

```dotenv
SPRING_DEVTOOLS_RESTART_ENABLED=true
```

`sbrt` displays:

```text
● AUTO
```

and shows:

```text
Auto Restart
```

The manual `r` action is not available.

### Restart unavailable

To disable DevTools restart:

```dotenv
SPRING_DEVTOOLS_RESTART_ENABLED=false
```

`sbrt` displays:

```text
● UNAVAILABLE
```

The manual restart action is not available.

The clean restart action remains available regardless of the DevTools restart configuration.

---

## Running sbrt

Run `sbrt` from the root of your Spring Boot project:

```bash
cd my-spring-project
sbrt
```

`sbrt` uses the current working directory and starts:

```bash
./mvnw spring-boot:run
```

The Spring Boot application's Maven output is displayed inside the TUI.

---

## Keyboard Controls

| Key         | Action                  |
| ----------- | ----------------------- |
| `↑`         | Scroll logs up 1 line   |
| `↓`         | Scroll logs down 1 line |
| `ctrl`+`↑`  | Scroll logs up 1 page   |
| `ctrl`+`↓`  | Scroll logs down 1 page |
| `shift`+`↑` | Go to beginning of logs |
| `shift`+`↓` | Go to latest logs       |
| `/`         | Search logs             |
| `r`         | Restart using DevTools  |
| `R`         | Clean restart           |
| `c`         | Clear logs              |
| `q`         | Quit                    |

The `r` action is only available when manual DevTools restart is configured.

`R` performs a clean restart:

```text
./mvnw clean
    ↓
./mvnw spring-boot:run
```

---

## Requirements

- Node.js
- npm
- Java
- Maven Wrapper (`./mvnw`)
- Spring Boot application
- Spring Boot DevTools for DevTools-based restart

---

## Current Scope

The current version of `sbrt` is intentionally focused on the development workflow used by Polygon Technology.

Currently:

- Maven projects are supported
- `./mvnw` is expected to be available
- The current working directory is treated as the Spring Boot project
- Spring Boot is started with `./mvnw spring-boot:run`

Support for other build tools and project types may be added in the future.

---

## License

`sbrt` is open source software licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for the complete license text.

Copyright © 2026
