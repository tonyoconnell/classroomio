import { writable } from 'svelte/store';

// export const deleteMemberModal = writable({
//   open: false,
// });

export const issueCertificateModal = writable({
  open: false,
  automatic: false,
  email: '',
  date: '',
  message: '',
});

export const certificateInfo = writable({
  Name: 'Name of student',
  Title: 'Desiging functional components',
  Desc: '(Introduction to Digital Devices, The Internet Mobile Applications, Introduction to Social Media, Using social media for business, Digital Content Creation and Distribution,  Using mobile money in business, Digital financial management,Digital Empowerment,Digital Safety)',
});

export const resetForm = () =>
  issueCertificateModal.update(() => ({
    open: false,
    automatic: false,
    email: '',
    date: '',
    message: '',
  }));