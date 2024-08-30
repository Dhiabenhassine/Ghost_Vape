const sequelize = require("../database");

const insertCaisse=async(req,res)=>{
    try{
const{CaisseDebut}=req.body
const queryInsert=`INSERT INTO Caisse (CaisseDebut)VALUES(:CaisseDebut)`
const resultQuery=await sequelize.query(queryInsert,{
    replacements:{CaisseDebut},
    type: sequelize.QueryTypes.INSERT
})
res.status(200).json({message:"Caisse enregistré avec succès"})
    }catch(err){
        res.status(500).send('err insert')
    }
}
const selectCaisse=async(req,res)=>{
    try{
const querySelect=`SELECT * FROM Caisse`
const resultQuery=await sequelize.query(querySelect,{
    type: sequelize.QueryTypes.SELECT
    })
    res.status(200).json(resultQuery)
    }catch(err){
        res.status(500).send('err select')
    }
}
const updateCaisse = async (req, res) => {
    try {
      const { ID_Caisee, CaisseFin } = req.body;
      
      const selectCaisse = `SELECT * FROM Caisse WHERE ID_Caisee = :ID_Caisee`;
      const resultQuery = await sequelize.query(selectCaisse, {
        replacements: { ID_Caisee },
        type: sequelize.QueryTypes.SELECT,
      });
  
      if (resultQuery.length > 0) {
        const benefice = CaisseFin - resultQuery[0].CaisseDebut;
  
        const queryUpdate = `UPDATE Caisse SET CaisseFin = :CaisseFin, BeneficeCaisse = :BeneficeCaisse WHERE ID_Caisee = :ID_Caisee`;
        await sequelize.query(queryUpdate, {
          replacements: { CaisseFin, BeneficeCaisse: benefice, ID_Caisee },
          type: sequelize.QueryTypes.UPDATE,
        });
  
        res.status(200).json({ message: "Caisse modifié avec succès" });
      } else {
        res.status(404).json({ message: "Caisse not found" });
      }
    } catch (err) {
      res.status(500).send('Error updating caisse');
    }
  };
  const VenteSuposer = async (req, res) => {
    try {
      // Query to select sales from the three tables
      const selectVenteLiquide = `
        SELECT DATE(created_at) AS created_at, SUM(TotalSales) AS TotalSalesLiquide
        FROM Sales
        GROUP BY DATE(created_at)
      `;
      const selectVenteVapes = `
        SELECT DATE(created_at) AS created_at, SUM(PrixVente) AS TotalSalesVapes
        FROM SalesVapes
        GROUP BY DATE(created_at)
      `;
      const selectVenteDivers = `
        SELECT DATE(created_at) AS created_at, SUM(Total) AS TotalSalesDivers
        FROM SalesDivers
        GROUP BY DATE(created_at)
      `;
      
      // Query to select expenses
      const selectDepense = `
        SELECT DATE(created_at) AS created_at, SUM(Depense) AS TotalDepense
        FROM Caisse
        GROUP BY DATE(created_at)
      `;
      
      // Execute queries
      const resultLiquide = await sequelize.query(selectVenteLiquide, { type: sequelize.QueryTypes.SELECT });
      const resultVapes = await sequelize.query(selectVenteVapes, { type: sequelize.QueryTypes.SELECT });
      const resultDivers = await sequelize.query(selectVenteDivers, { type: sequelize.QueryTypes.SELECT });
      const resultDepense = await sequelize.query(selectDepense, { type: sequelize.QueryTypes.SELECT });
  
      // Combine results by date
      const combinedResults = {};
  
      resultLiquide.forEach(row => {
        const date = row.created_at;
        if (!combinedResults[date]) combinedResults[date] = { TotalSales: 0, TotalDepense: 0, created_at: date };
        combinedResults[date].TotalSales += row.TotalSalesLiquide || 0;
      });
  
      resultVapes.forEach(row => {
        const date = row.created_at;
        if (!combinedResults[date]) combinedResults[date] = { TotalSales: 0, TotalDepense: 0, created_at: date };
        combinedResults[date].TotalSales += row.TotalSalesVapes || 0;
      });
  
      resultDivers.forEach(row => {
        const date = row.created_at;
        if (!combinedResults[date]) combinedResults[date] = { TotalSales: 0, TotalDepense: 0, created_at: date };
        combinedResults[date].TotalSales += row.TotalSalesDivers || 0;
      });
  
      resultDepense.forEach(row => {
        const date = row.created_at;
        if (!combinedResults[date]) combinedResults[date] = { TotalSales: 0, TotalDepense: 0, created_at: date };
        combinedResults[date].TotalDepense += row.TotalDepense || 0;
      });
  
      // Subtract expenses from total sales for each date
      const resultArray = Object.values(combinedResults).map(row => {
        return {
          created_at: row.created_at,
          NetSales: row.TotalSales - row.TotalDepense // Calculate net sales
        };
      });
  
      res.status(200).send(resultArray);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving sales data');
    }
  };
  
  
  const depense = async (req, res) => {
    try {
      const { ID_Caisee, Depense } = req.body;
  
      // Query to select depense by ID_Caisee
      const selectDepense = `
        SELECT created_at, Depense
        FROM Caisse
        WHERE ID_Caisee = :ID_Caisee
      `;
      
      // Query to update depense by ID_Caisee
      const updateDepense = `
        UPDATE Caisse 
        SET Depense = :Depense 
        WHERE ID_Caisee = :ID_Caisee
      `;
  
      // Execute the select query
      const result = await sequelize.query(selectDepense, { 
        replacements: { ID_Caisee: ID_Caisee },
        type: sequelize.QueryTypes.SELECT 
      });
  
      // Execute the update query
      const resultUpdate = await sequelize.query(updateDepense, {
        replacements: { ID_Caisee: ID_Caisee, Depense: Depense },
        type: sequelize.QueryTypes.UPDATE
      });
  
      // Send the update result as response
      res.status(200).send('updated');
    } catch (err) {
      // Send error response
      res.status(500).send('An error occurred');
    }
  };
  
  
  
module.exports={
    insertCaisse,
    selectCaisse,
    updateCaisse,
    VenteSuposer,
    depense
}