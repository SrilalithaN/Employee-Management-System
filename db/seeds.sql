INSERT INTO department (name)
VALUES ("Admininistration"),
       ("Finance"),
       ("HR"),
       ("Sales"),
       ("IT");

INSERT INTO role(title,salary,department_id)
VALUES
      ("Administrative Assistant", 80000,1),
      ("Admin Officer", 100000,1),     
      ("Accountant",90000,2),     
      ("Account Manager",110000,2),
      ("HR Associate", 90000,3),
      ("HR Manager", 110000, 3),
      ("Sales Assistant", 10000,4),
      ("Sales Manager", 120000,4),
      ("Associate Developer", 90000,5),
      ("Lead Developer", 120000, 5)

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
      ("Dwight","Schrute", 1, 2),
      ("Michael","Scott",2, null),
      ("Kevin","Malone",3,4),
      ("Oscar","Martinez",4,null),
      ("Creed","Bratton",5,6),
      ("Meredith","Palmer",6,null),
      ("Jim","Halpert",7,8),
      ("Pamela","Beesly",8,null),
      ("Angela","Martin",9,10),
      ("Andy","Bernard",10, null)