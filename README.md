## Development

### Gitpod Setup

1. Click the button below to open this project in Gitpod.

2. This will open a fully configured workspace in your browser with all the necessary dependencies already installed.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/rotimi-best/classroomio)

### Local Setup

1. Fork the repo, then clone it using the following command (remember to replace the url with the url from your forked repo)

   ```bash
   git clone https://github.com/rotimi-best/classroomio.git
   ```

2. Go to project folder

   ```bash
   cd classroomio
   ```

3. Set up Node if your Node version does not meet the project's requirements, as instructed by the documentation., "nvm" (Node Version Manager) allows using Node at the version required by the project:

   ```bash
   nvm use
   ```

   You first might need to install the specific version and then use it:

   ```bash
   nvm install && nvm use
   ```

   You can install nvm from [here](https://github.com/nvm-sh/nvm).

   You also need to have pnpm installed, you can find the installation guide [here](https://pnpm.io/installation#using-npm)

4. Set up your `.env` file

   - Go to `apps/classroomio-com`, `apps/dashboard` and `apps/backend`.
   - Duplicate the `.env.example` file and rename it to `.env`
   - Populate your .env files with the neccessary variables

To get the environmental variables for supabase continue to step(5)

5. Install all dependencies

   ```bash
   pnpm i
   ```

6. Setup Supabase.

   - Install and Start [docker](https://docs.docker.com/engine/install/)
   - Go to the project directory in your terminal and start Supabase

     ```bash
       pnpm supabase start
     ```

   - You should get a result like this

     ```bash
       supabase local development setup is running.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
           DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
       Studio URL: http://127.0.0.1:54323
     Inbucket URL: http://127.0.0.1:54324
       JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
         anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
     service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
     ```

   - Add Supabase environment variables into `app/dashboard` folder, which should be taken from the result of `pnpm supabase start`

     ```env
       PUBLIC_SUPABASE_URL=<API URL>
       PUBLIC_SUPABASE_ANON_KEY=<anon key>
       PRIVATE_SUPABASE_SERVICE_ROLE=<service_role key>
     ```

   - To view the Supabase studio, open the Studio URL from the result of `pnpm supabase start`

7. Run all projects (in development mode)

   ```bash
   pnpm dev
   ```

8. All projects should start running

   - `classroomio-com`: [http://localhost:5173](http://localhost:5173)
   - `backend`: [http://localhost:3002](http://localhost:3002)
   - `dashboard`: [http://localhost:5174](http://localhost:5174)
   - `docs`: [http://localhost:3000](http://localhost:3000)

9. Running a specific project

   - **classroomio-com**: `pnpm dev --filter=classroomio-com`
   - **backend**: `pnpm dev --filter=backend`
   - **dashboard**: `pnpm dev --filter=dashboard`
   - **docs**: `pnpm dev --filter=docs`

10. Login into `dashboard`

    - Visit [http://localhost:5173/login](http://localhost:5173/login)
    - Enter email: `admin@test.com`
    - Enter password: `123456`
     
    To learn more about how to login with a dummy account, [go here.](https://rebuildyou.co/docs/contributor-guides/demo-accounts)
