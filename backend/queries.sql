CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('PATIENT', 'DOCTOR', 'ADMIN') DEFAULT 'PATIENT',
    password VARCHAR(255) NOT NULL,
    phoneNo VARCHAR(15),
    gender ENUM('Male', 'Female'),
    age INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phoneNo VARCHAR(15),
    specialization VARCHAR(100) NOT NULL,
    experience INT NOT NULL,
    qualification VARCHAR(255),
    doctorId VARCHAR(20) NOT NULL UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Doctors_User
        FOREIGN KEY (doctorId)
        REFERENCES users(userId)
);


CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointmentId VARCHAR(50) NOT NULL UNIQUE,
    date DATETIME,
    time VARCHAR(50),
    status ENUM('PENDING', 'BOOKED', 'REJECTED') DEFAULT 'PENDING',
    notes TEXT,
    patientId VARCHAR(20) NOT NULL,
    doctorId VARCHAR(20) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Patient
        FOREIGN KEY (patientId)
        REFERENCES users(userId),

    CONSTRAINT FK_Doctor
        FOREIGN KEY (doctorId)
        REFERENCES doctors(doctorId)
);


CREATE TABLE chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    appointmentId VARCHAR(50) NOT NULL,
    senderId VARCHAR(20) NOT NULL,
    receiverId VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Chat_Appointment
        FOREIGN KEY (appointmentId)
        REFERENCES appointments(appointmentId),

    CONSTRAINT FK_Chat_Sender
        FOREIGN KEY (senderId)
        REFERENCES users(userId),

    CONSTRAINT FK_Chat_Receiver
        FOREIGN KEY (receiverId)
        REFERENCES users(userId)
);