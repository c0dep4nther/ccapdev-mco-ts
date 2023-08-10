import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

async function page() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items start gap-8">
        <h1 className="font-bold text-3xl md:text-4xl">About FilmFusion</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Disclaimer</CardTitle>
            </CardHeader>

            <CardContent>
              <strong>FilmFusion</strong> is a forum web application in partial fulfillment of the requirements
              for CCAPDEV (Web Application Development) class at De La Salle Unversity - Manila.
              This site is created solely for academic purposes and serves as a simulated platform
              designed as part of a school project.<br></br><br></br>
              
              It does not represent the experiences or opinions of
              any specific individuals. Users are accountable for the content of their posts, and the developers
              are exempt from liability for any data posted. The intent of this project is not to deliver precise
              information about the real world.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Development</CardTitle>
            </CardHeader>

            <CardContent>
              This web application is developed by <strong>CCAPDEV S14 Group 7</strong> composed of the following members:<br></br>
              <a href="https://github.com/c0dep4nther" className="hover:underline">Mark Daniel Gutierrez</a><br></br>
              <a href="https://github.com/angelocguerra" className="hover:underline">Angelo Guerra</a><br></br>
              <a href="https://github.com/itscheriespace"className="hover:underline">Trisha Alissandra Sayo</a><br></br>
              <a href="https://github.com/jonjacinto" className="hover:underline">Jon Piolo Jacinto</a><br></br>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            
            <CardContent>
              The following technologies were used in the development of this web application:<br></br>
              Next.js 13 (Web Framework)<br></br>
              React (Web Framework)<br></br>
              Auth (Authentication)<br></br>
              Tailwind CSS (CSS Framework)<br></br>
              Prisma (Database)<br></br>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dependencies</CardTitle>
            </CardHeader>

            <CardContent>
              The following NPM packages were used in the development of this web application:<br></br>
              @editorjs<br></br>
              @hookform/resolvers 3.1.1<br></br>
              @mantine/core 6.0.16<br></br>
              @mantine/hooks 6.0.16<br></br>
              @next-auth/prisma-adapter 1.0.7<br></br>
              @prisma/client 5.0.0<br></br>
              @radix-ui<br></br>
              @tanstack/react-query 4.29.23<br></br>
              @types <br></br>
              @uploadthing/react 5.2.0<br></br>
              @upstash/redis 1.22.0<br></br>
              autoprefixer 10.4.14<br></br>
              axios 1.4.0<br></br>
              eslint 8.45.0<br></br>
              framer-motion 10.15.0<br></br>
              lodash.debounce 4.0.8<br></br>
              lucide-react 0.260.0<br></br>
              next 13.4.10<br></br>
              next-auth 4.22.1<br></br>
              node 16.0.0<br></br>
              postcss 8.4.26<br></br>
              postinstall 0.8.0<br></br>
              prisma 5.0.0<br></br>
              react 18.2.0<br></br>
              react-dom 18.2.0<br></br>
              react-dropzone 14.2.3<br></br>
              react-hook-form 7.45.1<br></br>
              react-textarea-autosize 8.5.2<br></br>
              tailwind-merge 1.13.2<br></br>
              tailwindcss 3.3.3<br></br>
              tailwindcss-animate 1.0.6<br></br>
              typescript 5.1.6<br></br>
              uploadthing 5.2.0<br></br>
              zod 3.21.4<br></br>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default page;
