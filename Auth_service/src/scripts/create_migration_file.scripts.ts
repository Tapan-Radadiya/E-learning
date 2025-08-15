import { exec } from "child_process"

const createSequalizeMigrationFile = () => {
    const fileName = process.argv[2]
    if (fileName) {
        exec(`pnpm sequelize-cli migration:generate --name ${fileName}`)
    } else {
        console.log("Please provide the migration name")
    }
}


createSequalizeMigrationFile()