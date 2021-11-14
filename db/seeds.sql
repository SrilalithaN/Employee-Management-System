USE employee_db;

INSERT INTO department (dept_name)
VALUES ("Admininistration"),
       ("Finance"),
       ("HR"),
       ("Sales"),
       ("IT");

INSERT INTO roles(title,salary,department_id)
VALUES
      ("CEO", 150000,null),
      ("Admin Assistant", 80000,1),  
      ("Account Manager",110000,2),   
      ("Accountant",90000,2),     
       ("HR Manager", 110000, 3),
      ("HR Associate", 90000,3),
       ("Sales Manager", 120000,4),
      ("Sales Assistant", 10000,4),
       ("Lead Developer", 120000, 5),
      ("Associate Developer", 90000,5);
     

INSERT INTO employee (first_name,last_name,roles_id,manager_id)
VALUES
    ("Michael","Scott",1, null),
    ("Dwight","Schrute", 2, 1),
    ("Oscar","Martinez",3,1),
    ("Kevin","Malone",4,3),
   ("Meredith","Palmer",5,1),
    ("Creed","Bratton",6,4),
    ("Pamela","Beesly",7,1),
    ("Jim","Halpert",8,1),
    ("Andy","Bernard",9, 3),
    ("Angela","Martin",10,1);


  