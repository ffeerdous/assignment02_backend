const Employee = require('./models/Employee');
const { merge } = require('lodash');
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const resolver1 = {
    Query: {
        getEmployees: async (parent, args) => {
            return Employee.find({})
        },
        getEmployeeByID: async (parent, args) => {
            return Employee.findById(args.id)
        },
        getEmployeeByGender: async (parent, args) => {
            return Employee.find({"gender" : args.gender})
        },
        getEmployeeByEmail: async (parent, args) => {
            try {
              const employee = await Employee.findOne({ email: args.email });
              if (!employee) {
                throw new Error("Employee not found");
              }
              return employee;
            } catch (err) {
              throw new Error(err);
            }
        }
    },

    Mutation: {
        addEmployee: async (parent, args) => {
            console.log(args)

            let newEmp = new Employee({
                firstname: args.firstname,
                lastname: args.lastname,
                email: args.email,
                gender: args.gender,
                city: args.city,
                designation: args.designation,
                salary: args.salary
            })

            return newEmp.save()
        },
        updateEmployee: async (parent, args) => {
            console.log(args)
            if (!args.email){
                return;
            }
          
            try {
              const updatedEmployee = await Employee.findOneAndUpdate(
                { email: args.email },
                {
                  $set: {
                    firstname: args.firstname,
                    lastname: args.lastname,
                    gender: args.gender,
                    city: args.city,
                    designation: args.designation,
                    salary: args.salary
                  }
                },
                { new: true }
              );
          
              return updatedEmployee;
            } catch (err) {
              console.log("Something went wrong when updating the employee", err);
              throw new Error("Failed to update employee");
            }
        },
      deleteEmployee: async (parent, { email }) => {
        const deletedEmployee = await Employee.findOneAndDelete({ email })
        if (deletedEmployee) {
          return deletedEmployee
        } else {
          throw new Error(`Employee with email ${email} not found`)
        }
      }
    }
}

const resolver2 = {
    Query: {
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username });
            if (!user) {
              throw new Error('Invalid login credentials');
            }
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
              throw new Error('Invalid login credentials');
            }
            return { user};
          }
    },

    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ username, email, password: hashedPassword });
            return { user };
        }
    }
}

const resolvers = merge(resolver1, resolver2);
module.exports = resolvers;