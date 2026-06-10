# Project Structure and Design Patterns

The project must follow a clean and modular structure.

Use a monorepo-style organization:

/sga-associacao-abracos
  /docs
  /backend
  /frontend
  docker-compose.yml
  .env.example
  README.md

---

# Backend Structure

Use Node.js + Express + TypeScript.

The backend must follow layered architecture:

- routes: HTTP route definitions
- controllers: receive requests and responses
- services: business rules
- repositories: database access
- middlewares: authentication, authorization and error handling
- validators: request validation
- config: environment and database configuration
- utils: helper functions

Expected structure:

/backend
  /src
    /config
      database.ts
      env.ts

    /modules
      /auth
        auth.routes.ts
        auth.controller.ts
        auth.service.ts
        auth.middleware.ts

      /users
        users.routes.ts
        users.controller.ts
        users.service.ts
        users.repository.ts
        users.types.ts

      /students
        students.routes.ts
        students.controller.ts
        students.service.ts
        students.repository.ts
        students.types.ts

      /courses
        courses.routes.ts
        courses.controller.ts
        courses.service.ts
        courses.repository.ts
        courses.types.ts

      /classes
        classes.routes.ts
        classes.controller.ts
        classes.service.ts
        classes.repository.ts
        classes.types.ts

      /enrollments
        enrollments.routes.ts
        enrollments.controller.ts
        enrollments.service.ts
        enrollments.repository.ts
        enrollments.types.ts

      /attendance
        attendance.routes.ts
        attendance.controller.ts
        attendance.service.ts
        attendance.repository.ts
        attendance.types.ts

      /grades
        grades.routes.ts
        grades.controller.ts
        grades.service.ts
        grades.repository.ts
        grades.types.ts

      /inventory
        inventory.routes.ts
        inventory.controller.ts
        inventory.service.ts
        inventory.repository.ts
        inventory.types.ts

      /orders
        orders.routes.ts
        orders.controller.ts
        orders.service.ts
        orders.repository.ts
        orders.types.ts

      /dashboard
        dashboard.routes.ts
        dashboard.controller.ts
        dashboard.service.ts
        dashboard.repository.ts

    /shared
      /middlewares
        error-handler.ts
        require-auth.ts
        require-role.ts

      /utils
        api-response.ts
        async-handler.ts
        date-utils.ts

      /validators
        common.validators.ts

    app.ts
    server.ts

  Dockerfile
  package.json
  tsconfig.json

---

# Backend Pattern Rules

The agent must follow these rules:

1. Routes only define endpoints and middleware.
2. Controllers only handle HTTP request/response.
3. Services contain business rules.
4. Repositories contain SQL queries.
5. Controllers must not access the database directly.
6. Services must not depend on Express request/response objects.
7. Validation must happen before business logic.
8. Errors must be handled by a global error handler.
9. Authentication and authorization must be implemented as middleware.
10. SQL queries must be parameterized.

---

# Frontend Structure

Use Next.js + TypeScript + TailwindCSS.

Expected structure:

/frontend
  /src
    /app
      /(auth)
        /login
          page.tsx

      /(dashboard)
        layout.tsx
        page.tsx

        /alunos
          page.tsx
          /novo
            page.tsx
          /[id]
            page.tsx

        /cursos
          page.tsx

        /turmas
          page.tsx

        /matriculas
          page.tsx

        /presencas
          page.tsx

        /notas
          page.tsx

        /estoque
          page.tsx

        /pedidos
          page.tsx

        /usuarios
          page.tsx

    /components
      /ui
      /layout
        Sidebar.tsx
        Header.tsx
        DashboardLayout.tsx

      /forms
        StudentForm.tsx
        CourseForm.tsx
        ClassForm.tsx
        EnrollmentForm.tsx
        AttendanceForm.tsx
        GradeForm.tsx
        OrderForm.tsx

      /tables
        StudentsTable.tsx
        CoursesTable.tsx
        ClassesTable.tsx
        EnrollmentsTable.tsx
        AttendanceTable.tsx
        GradesTable.tsx
        InventoryTable.tsx
        OrdersTable.tsx

    /services
      api.ts
      auth.service.ts
      students.service.ts
      courses.service.ts
      classes.service.ts
      enrollments.service.ts
      attendance.service.ts
      grades.service.ts
      inventory.service.ts
      orders.service.ts
      dashboard.service.ts

    /hooks
      useAuth.ts
      useStudents.ts
      useCourses.ts

    /types
      user.ts
      student.ts
      course.ts
      class.ts
      enrollment.ts
      attendance.ts
      grade.ts
      inventory.ts
      order.ts

    /utils
      formatDate.ts
      formatPhone.ts
      formatStatus.ts

  Dockerfile
  package.json
  tsconfig.json
  tailwind.config.ts

---

# Frontend Pattern Rules

The agent must follow these rules:

1. Pages should only compose components.
2. API calls must stay inside /services.
3. Reusable forms must stay inside /components/forms.
4. Reusable tables must stay inside /components/tables.
5. Shared UI components must stay inside /components/ui.
6. Types must stay inside /types.
7. Avoid duplicated code.
8. Use responsive layouts.
9. The interface must be simple and accessible.
10. The professor interface must work well on mobile phones.

---

# Naming Standards

Use English for code and folder names.

Use Portuguese for user-facing labels.

Examples:

Code:

students
courses
enrollments
attendance

UI labels:

Alunos
Cursos
Matrículas
Presenças

---

# Recommended Design Patterns

Backend:

- Layered Architecture
- Repository Pattern
- Service Layer Pattern
- Middleware Pattern
- DTO/Validation Pattern

Frontend:

- Component-Based Architecture
- Service Pattern for API calls
- Custom Hooks for reusable state
- Layout Pattern for dashboard pages