import React from 'react';
import { Routes, Route } from 'react-router-dom'; // ✅ Correct import
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/clients/Clients';
import ClientDetails from '../pages/clients/ClientDetails';
import AddClient from '../pages/clients/AddClient';
import EditClient from '../pages/clients/EditClient';
import Program from '../pages/programs/Programs';
import AddProgram from '../pages/programs/AddProgram';
import ProgramDetails from '../pages/programs/ProgramDetails';
import ProgramList from '../pages/programs/ProgramList';
import EditProgram from '../pages/programs/EditProgram';
import Enrollment from '../pages/Enrollment/Enrollment';
import EnrollmentDetails from '../pages/Enrollment/EnrollmentDetails';
import AddEnrollment from '../pages/Enrollment/AddEnrollment';
import EditEnrollment from '../pages/Enrollment/EditEnrollment';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/add" element={<AddClient />} />
        <Route path="clients/edit/:clientId" element={<EditClient />} />
        <Route path="clients/:clientId" element={<ClientDetails />} />
        <Route path="programs" element={<Program />} />
        <Route path="programs/add" element={<AddProgram />} />
        <Route path="programs/list" element={<ProgramList />} />
        <Route path="/programs/details/:programId" element={<ProgramDetails />} />
        <Route path="programs/edit/:programId" element={<EditProgram />} />
        <Route path="/enrollments" element={<Enrollment />} />
        <Route path="/enrollments/details/:enrollmentId" element={<EnrollmentDetails />} />
        <Route path="/enrollments/create" element={<AddEnrollment />} />
        <Route path="/enrollments/edit/:enrollmentId" element={<EditEnrollment />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
