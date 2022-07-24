import { NextPage } from "next";
import { useSession } from "next-auth/react";
import DashboardLayout from "../../components/layouts/dashboard";
import LinkForm from "../../components/base/LinkForm";
import ApiTokenForm from "../../components/base/ApiTokenForm";
import { useEffect } from "react";

const getLinks = async () => {
   const response = await fetch('/api/link', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
   });

   const data = await response.json();
   return data;
};

const Dashboard: NextPage = () => {
   const { data: session, status } = useSession({ required: true });

   useEffect(() => {
      if (status !== 'authenticated') return;
      getLinks().then(links => {
         console.log(links);
      })
   }, [status]);

   return (
      <DashboardLayout>
         <h1>Welcome {session?.user?.name ?? "nameless user"}!</h1>
         <h2>Your Links</h2>
         <br></br>
         <LinkForm />
         <br></br>
         <ApiTokenForm />
      </DashboardLayout>
   );
}

export default Dashboard;