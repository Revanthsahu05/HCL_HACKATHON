// Standard Slots: 9 AM to 5 PM, 1 hour each, Lunch 1-2 PM
const STANDARD_SLOTS = [
    { time: '09:00 AM - 10:00 AM', available: true },
    { time: '10:00 AM - 11:00 AM', available: true },
    { time: '11:00 AM - 12:00 PM', available: true },
    { time: '12:00 PM - 01:00 PM', available: true },
    // 01:00 PM - 02:00 PM is LUNCH (Skipped)
    { time: '02:00 PM - 03:00 PM', available: true },
    { time: '03:00 PM - 04:00 PM', available: true },
    { time: '04:00 PM - 05:00 PM', available: true },
];

// Helper to randomize availability
const getRandomSlots = () => {
    return STANDARD_SLOTS.map(slot => ({
        ...slot,
        available: Math.random() > 0.3 // 70% chance of being available
    }));
};

export const DOCTORS = [
    // General Physician
    {
        id: 'gp1',
        name: 'Dr. John Doe',
        specialization: 'General Physician',
        slots: getRandomSlots()
    },
    {
        id: 'gp2',
        name: 'Dr. Jane Smith',
        specialization: 'General Physician',
        slots: getRandomSlots()
    },
    // Gynecologist
    {
        id: 'gyn1',
        name: 'Dr. Emily Rose',
        specialization: 'Gynecologist',
        slots: getRandomSlots()
    },
    {
        id: 'gyn2',
        name: 'Dr. Sarah Connor',
        specialization: 'Gynecologist',
        slots: getRandomSlots()
    },
    // Dermatologist
    {
        id: 'derm1',
        name: 'Dr. Mike Ross',
        specialization: 'Dermatologist',
        slots: getRandomSlots()
    },
    {
        id: 'derm2',
        name: 'Dr. Rachel Zane',
        specialization: 'Dermatologist',
        slots: getRandomSlots()
    },
    // Pediatrician
    {
        id: 'ped1',
        name: 'Dr. Gregory House',
        specialization: 'Pediatrician',
        slots: getRandomSlots()
    },
    {
        id: 'ped2',
        name: 'Dr. James Wilson',
        specialization: 'Pediatrician',
        slots: getRandomSlots()
    },
    // Neurologist
    {
        id: 'neu1',
        name: 'Dr. Stephen Strange',
        specialization: 'Neurologist',
        slots: getRandomSlots()
    },
    {
        id: 'neu2',
        name: 'Dr. Derek Shepherd',
        specialization: 'Neurologist',
        slots: getRandomSlots()
    }
];

export const INITIAL_QUEUE = [
    {
        id: 'upt1',
        patientName: 'Alice Smith',
        status: 'IN_PROGRESS',
        time: '09:00 AM',
        age: 29,
        gender: 'Female',
        illnessHistory: 'Chronic Migraine, Nausea'
    },
    {
        id: 'upt2',
        patientName: 'Bob Jones',
        status: 'WAITING',
        time: '09:30 AM',
        age: 45,
        gender: 'Male',
        illnessHistory: 'High Blood Pressure, Recent Dizziness'
    },
    {
        id: 'upt3',
        patientName: 'Charlie Brown',
        status: 'WAITING',
        time: '10:00 AM',
        age: 8,
        gender: 'Male',
        illnessHistory: 'Viral Fever, Cough'
    }
];

export const MY_APPOINTMENTS = [
    {
        id: 'appt1',
        doctorName: 'Dr. Emily Rose',
        doctorSpecialization: 'Gynecologist',
        date: '2025-12-20',
        time: '09:00 AM - 10:00 AM',
        status: 'BOOKED'
    }
];
