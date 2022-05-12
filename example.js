(async() => {
    const neo4j = require('neo4j-driver')
    require('dotenv').config();
    
    const uri = 'neo4j+s://ae9ca9ae.databases.neo4j.io';
    const user = process.env.NEO4J_USERNAME;
    const password = process.env.NEO4J_PASSWORD;
    
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = driver.session()
   
    const csv_path = 'https://drive.google.com/file/d/13hIPkizpVsHLlLeI60DTxWWZmp0OBKua/view?usp=sharing'
   
    try {
      // To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
      // The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
      const writeQuery = `LOAD CSV WITH HEADERS FROM '${csv_path}' AS line
                          CREATE (c:Coordinate {id: line.id, latitude: toFloat(line.lat), longitude: toFloat(line.lon)})
                          RETURN c`
   
      // Write transactions allow the driver to handle retries and transient errors
      const writeResult = await session.writeTransaction(tx =>
        tx.run(writeQuery)
      )
      writeResult.records.forEach(record => {
        const coordinate = record.get('c')
        console.log(
          `Created node: ${coordinate.properties.id}`
        )
      })
   
      // const readQuery = `MATCH (p:Person)
      //                    WHERE p.name = $personName
      //                    RETURN p.name AS name`
      // const readResult = await session.readTransaction(tx =>
      //   tx.run(readQuery, { personName: person1Name })
      // )
      // readResult.records.forEach(record => {
      //   console.log(`Found person: ${record.get('name')}`)
      // })
    } catch (error) {
      console.error('Something went wrong: ', error)
    } finally {
      await session.close()
    }
   
    // Don't forget to close the driver connection when you're finished with it
    await driver.close()
   })();