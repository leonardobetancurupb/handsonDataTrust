# **Welcome to the handsonDataTrust Repository**

## **Project Overview**
This project implements a DataTrust platform, a data trust service that allows users to securely store and share data. The platform ensures that those who access the data comply with the established policies and compensate the data owners according to the agreed terms.

The application uses a modern architecture that integrates various technologies such as **Django** for backend logic, **Blockchain** for ensuring transparency and immutability of transactions, **NoSQL databases** for flexible and scalable data storage, and **containers (Docker Compose)** to facilitate service deployment and management.

## **Key Features**
- **Reliable Data Management**: Users can upload their data and define access policies.
- **Transparent Transactions**: Every interaction with the data is recorded on a blockchain, ensuring transparency and immutability.
- **Scalable Storage**: NoSQL databases are used to handle large volumes of data efficiently (MongoDB).
- **Simplified Deployment**: Docker Compose is used to orchestrate and deploy the necessary services.

## **Technologies Used**
- **Django**: A high-level Python web framework that provides robust tools for building the backend.
- **Blockchain**: Used to record and secure all transactions related to the data.
- **NoSQL Databases**: Flexible and scalable storage, ideal for handling large volumes of data.
- **Docker & Docker Compose**: Facilitate the containerization of services and their deployment in development and production environments.

## **Project Structure**
The project is organized as follows:

- **/audit/**: Implementation of the blockchain layer for the platform.
- **/backend/**: Django app for backend module and configuration and scripts related to the NoSQL database.
- **/frontend/**: GUI.
- **/verify/**: Check when a policy expired.
- **/script/**: Populate the database.

## **Getting Started**
### **Prerequisites**
- **Docker**: Ensure that Docker and Docker Compose are installed.
- **Python 3.8+**: Required to run the Django development environment and scripts.
  

### **Setup Instructions**
1. **Clone the repository**:
   ```bash
   git clone https://github.com/leonardobetancurupb/handsonDataTrust.git
   cd handsonDataTrust
   ```
2. **Manual configurations**:
   **!IMPORTANT!**
   You need to change your IP or hostname on file 'frontend\main\src\utils\key.txt'.

4. **Build and run the containers**:
   ```bash
   sudo docker compose up -d --build
   ```

5. **Set up the environment and Scripts**:
   ```bash
   cd scripts
   sudo apt install python3-venv
   python3 -m venv myenv
   source myenv/bin/activate
   pip install -r requirements.txt
   ```
   You need to change the url to your domain or ip in line 12 of the populate_data.py file

   ```bash
   python populate_data.py
   ```

6. **Access the application**:
Open your web browser and go to http://localhost:80 to see the application running.

### Contributing
We welcome contributions! If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a branch for your feature or bugfix.
3. Make your changes and ensure everything works correctly.
4. Submit a pull request detailing the changes you made.

### Contact
For questions, suggestions, or bug reports, please open an issue or contact the project maintainers.

#### Authors:
- Leonardo Bentacur  mail: leonardo.betancur@upb.edu.co
- Jorge Mario Londono mail: jorge.londono@upb.edu.co
- Juan Pablo Montoya mail: juanmontoyao1803@gmail.com
- John Andersson Cardenas mail: a.cardenas.quiros@gmail.com 
- Luisa Alvarez mail: luisa.alvabello@gmail.com
