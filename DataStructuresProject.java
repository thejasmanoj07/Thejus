
import java.util.LinkedList;
import java.util.PriorityQueue;
import java.util.Comparator;
import java.util.Scanner;

public class DataStructuresProject {

    static Scanner sc = new Scanner(System.in);

    static class Student {
        int rollNo;
        String name;
        double marks;
        String grade;

        Student(int rollNo, String name, double marks) {
            this.rollNo = rollNo;
            this.name = name;
            this.marks = marks;
            this.grade = calculateGrade(marks);
        }

        static String calculateGrade(double marks) {
            if (marks >= 90) return "A+";
            if (marks >= 80) return "A";
            if (marks >= 70) return "B";
            if (marks >= 60) return "C";
            if (marks >= 50) return "D";
            return "F";
        }

        void display() {
            System.out.printf("%-10d %-20s %-10.2f %-10s%n",
                    rollNo, name, marks, grade);
        }
    }

    static LinkedList<Student> students = new LinkedList<>();

    static class Task {
        String name;
        int priority;
        int taskId;

        Task(int taskId, String name, int priority) {
            this.taskId = taskId;
            this.name = name;
            this.priority = priority;
        }

        void display() {
            String level = switch (priority) {
                case 1 -> "High";
                case 2 -> "Medium";
                default -> "Low";
            };

            System.out.printf("%-10d %-25s %-10s%n",
                    taskId, name, level);
        }
    }

    static PriorityQueue<Task> tasks = new PriorityQueue<>(
            Comparator.comparingInt((Task t) -> t.priority)
                    .thenComparingInt(t -> t.taskId)
    );

    static int nextTaskId = 1;

    public static void main(String[] args) {
        while (true) {
            System.out.println("\n==================================");
            System.out.println("     DATA STRUCTURES PROJECT");
            System.out.println("==================================");
            System.out.println("1. Student Record Management");
            System.out.println("2. Task Management System");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");

            int choice = readInt();

            switch (choice) {
                case 1 -> studentMenu();
                case 2 -> taskMenu();
                case 3 -> {
                    System.out.println("Thank you for using the system.");
                    sc.close();
                    return;
                }
                default -> System.out.println("Invalid choice.");
            }
        }
    }

    static void studentMenu() {
        while (true) {
            System.out.println("\n--- STUDENT RECORD MANAGEMENT ---");
            System.out.println("1. Add Student");
            System.out.println("2. Search Student");
            System.out.println("3. Update Student");
            System.out.println("4. Delete Student");
            System.out.println("5. Display All Students");
            System.out.println("6. Back to Main Menu");
            System.out.print("Enter your choice: ");

            int choice = readInt();

            switch (choice) {
                case 1 -> addStudent();
                case 2 -> searchStudent();
                case 3 -> updateStudent();
                case 4 -> deleteStudent();
                case 5 -> displayStudents();
                case 6 -> {
                    return;
                }
                default -> System.out.println("Invalid choice.");
            }
        }
    }

    static void addStudent() {
        System.out.print("Enter roll number: ");
        int rollNo = readInt();

        if (findStudent(rollNo) != null) {
            System.out.println("Roll number already exists.");
            return;
        }

        System.out.print("Enter student name: ");
        String name = sc.nextLine();

        System.out.print("Enter marks (0-100): ");
        double marks = readDouble();

        if (marks < 0 || marks > 100) {
            System.out.println("Marks must be between 0 and 100.");
            return;
        }

        students.add(new Student(rollNo, name, marks));
        System.out.println("Student added successfully.");
    }

    static Student findStudent(int rollNo) {
        for (Student s : students) {
            if (s.rollNo == rollNo) {
                return s;
            }
        }
        return null;
    }

    static void searchStudent() {
        System.out.print("Enter roll number to search: ");
        int rollNo = readInt();

        Student s = findStudent(rollNo);

        if (s == null) {
            System.out.println("Student not found.");
        } else {
            printStudentHeader();
            s.display();
        }
    }

    static void updateStudent() {
        System.out.print("Enter roll number to update: ");
        int rollNo = readInt();

        Student s = findStudent(rollNo);

        if (s == null) {
            System.out.println("Student not found.");
            return;
        }

        System.out.print("Enter new name: ");
        s.name = sc.nextLine();

        System.out.print("Enter new marks (0-100): ");
        double marks = readDouble();

        if (marks < 0 || marks > 100) {
            System.out.println("Invalid marks. Update cancelled.");
            return;
        }

        s.marks = marks;
        s.grade = Student.calculateGrade(marks);

        System.out.println("Student updated successfully.");
    }

    static void deleteStudent() {
        System.out.print("Enter roll number to delete: ");
        int rollNo = readInt();

        Student s = findStudent(rollNo);

        if (s == null) {
            System.out.println("Student not found.");
        } else {
            students.remove(s);
            System.out.println("Student deleted successfully.");
        }
    }

    static void displayStudents() {
        if (students.isEmpty()) {
            System.out.println("No student records available.");
            return;
        }

        printStudentHeader();

        for (Student s : students) {
            s.display();
        }
    }

    static void printStudentHeader() {
        System.out.printf("%-10s %-20s %-10s %-10s%n",
                "Roll No", "Name", "Marks", "Grade");
        System.out.println("--------------------------------------------------");
    }

    static void taskMenu() {
        while (true) {
            System.out.println("\n--- TASK MANAGEMENT SYSTEM ---");
            System.out.println("1. Add Task");
            System.out.println("2. Process Highest-Priority Task");
            System.out.println("3. View Pending Tasks");
            System.out.println("4. Back to Main Menu");
            System.out.print("Enter your choice: ");

            int choice = readInt();

            switch (choice) {
                case 1 -> addTask();
                case 2 -> processTask();
                case 3 -> displayTasks();
                case 4 -> {
                    return;
                }
                default -> System.out.println("Invalid choice.");
            }
        }
    }

    static void addTask() {
        System.out.print("Enter task description: ");
        String name = sc.nextLine();

        System.out.println("Priority: 1 = High, 2 = Medium, 3 = Low");
        System.out.print("Enter priority: ");
        int priority = readInt();

        if (priority < 1 || priority > 3) {
            System.out.println("Invalid priority.");
            return;
        }

        tasks.add(new Task(nextTaskId++, name, priority));
        System.out.println("Task added successfully.");
    }

    static void processTask() {
        Task task = tasks.poll();

        if (task == null) {
            System.out.println("No pending tasks.");
        } else {
            System.out.println("Task processed successfully:");
            System.out.println("Task ID: " + task.taskId);
            System.out.println("Description: " + task.name);
        }
    }

    static void displayTasks() {
        if (tasks.isEmpty()) {
            System.out.println("No pending tasks.");
            return;
        }

        PriorityQueue<Task> copy = new PriorityQueue<>(tasks);

        System.out.printf("%-10s %-25s %-10s%n",
                "Task ID", "Description", "Priority");
        System.out.println("-----------------------------------------------");

        while (!copy.isEmpty()) {
            copy.poll().display();
        }
    }

    static int readInt() {
        while (true) {
            try {
                int value = Integer.parseInt(sc.nextLine().trim());
                return value;
            } catch (NumberFormatException e) {
                System.out.print("Enter a valid integer: ");
            }
        }
    }

    static double readDouble() {
        while (true) {
            try {
                return Double.parseDouble(sc.nextLine().trim());
            } catch (NumberFormatException e) {
                System.out.print("Enter a valid number: ");
            }
        }
    }
}
