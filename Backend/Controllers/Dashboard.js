const sequelize = require("../database");
const selectLiquide = async (req, res) => {
    try {
      const querySelectLiquide = `
        SELECT TypeLiquide, COUNT(*) as Count 
        FROM StockLiquide 
        WHERE TypeLiquide IN ('Gourmand', 'Fruite') 
        GROUP BY TypeLiquide
      `;
      const resultQuery = await sequelize.query(querySelectLiquide, {
        type: sequelize.QueryTypes.SELECT
      });
      res.send(resultQuery);
    } catch (err) {
      res.status(500).send('Error selecting');
    }
  };
  
  const selectVenteParJour = async (req, res) => {
    try {
      // Query for total liquide sales
      const queryVenteLiquide = `SELECT SUM(TotalSales) AS totalLiquideSales FROM Sales WHERE DATE(created_at) = CURDATE()`;
      const resultQueryLiquide = await sequelize.query(queryVenteLiquide, {
        type: sequelize.QueryTypes.SELECT,
      });
      console.log('Liquide Sales Result:', resultQueryLiquide);
  
      // Query for total vape sales
      const queryVenteVapes = `SELECT SUM(PrixVente) AS totalVapeSales FROM SalesVapes WHERE DATE(created_at) = CURDATE()`;
      const resultQueryVapes = await sequelize.query(queryVenteVapes, {
        type: sequelize.QueryTypes.SELECT,
      });
      console.log('Vape Sales Result:', resultQueryVapes);
  
      // Query for total divers sales
      const queryVenteDivers = `SELECT SUM(Total) AS totalDiversSales FROM SalesDivers WHERE DATE(created_at) = CURDATE()`;
      const resultQueryDivers = await sequelize.query(queryVenteDivers, {
        type: sequelize.QueryTypes.SELECT,
      });
      console.log('Divers Sales Result:', resultQueryDivers);
  
      // Calculate total ventes
      const totalVentes =
        (parseFloat(resultQueryLiquide[0].totalLiquideSales) || 0) +
        (parseFloat(resultQueryVapes[0].totalVapeSales) || 0) +
        (parseFloat(resultQueryDivers[0].totalDiversSales) || 0);
  
      res.send({ totalVentes: totalVentes.toFixed(0) }); // Round to nearest whole number if needed
    } catch (err) {
      console.error('Error selecting sales:', err);
      res.status(500).send('Error selecting');
    }
  };
  
const selectCreditParJour=async(req,res)=>{
  try{
const queryCredit=`SELECT SUM(Credit) FROM Credit`
const resultQueryCredit=await sequelize.query(queryCredit,{type:sequelize.QueryTypes.SELECT})
res.send(resultQueryCredit)
  }catch(err){
    res.status(500).send('Error selecting');
  }
}  
  const selectFlaconEmpty=async(req,res)=>{
    try{
const queryFlacon=`SELECT SUM(nbrFlaconEmpty) FROM StockFlacon`
const resultQueryFlacon=await sequelize.query(queryFlacon,{type:sequelize.QueryTypes.SELECT})
res.send(resultQueryFlacon)
    }catch(err){
      res.status(500).send('Error selecting');
    }
  }
  const selectFlaconUsed = async (req, res) => {
    try {
      const queryFlaconUsed = `
        SELECT SUM(NbrFlaconSale) AS totalFlaconUsed 
        FROM Sales 
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())`;
  
      const resultQueryFlacon = await sequelize.query(queryFlaconUsed, {
        type: sequelize.QueryTypes.SELECT
      });
  
      const totalFlaconUsed = resultQueryFlacon[0]?.totalFlaconUsed || 0;
  
      res.status(200).json({ totalFlaconUsed });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error selecting');
    }
  };
  
  const top5liquide = async (req, res) => {
    try {
      const queryselect = `
        SELECT NomLiquide, COUNT(TotalSales) as TotalSales, DATE_FORMAT(created_at, '%Y-%m') as SalesMonth
        FROM Sales
        WHERE DATE_FORMAT(created_at, '%Y-%m') = DATE_FORMAT(CURDATE(), '%Y-%m')
        GROUP BY NomLiquide, SalesMonth
        ORDER BY TotalSales DESC
        LIMIT 5;
      `;
  
      const resultquery = await sequelize.query(queryselect, {
        type: sequelize.QueryTypes.SELECT,
      });
  
      res.json(resultquery);
    } catch (err) {
      console.error('Error selecting:', err);
      res.status(500).send('Error selecting');
    }
  };
  
  const selectVenteParMois = async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-indexed month
  
      const queryVenteLiquide = `
        SELECT SUM(TotalSales) AS totalLiquideSales 
        FROM Sales 
        WHERE YEAR(created_at) = :year AND MONTH(created_at) = :month`;
      const resultQueryLiquide = await sequelize.query(queryVenteLiquide, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { year: currentYear, month: currentMonth },
      });
  
      const queryVenteVapes = `
        SELECT SUM(PrixVente) AS totalVapeSales 
        FROM SalesVapes 
        WHERE YEAR(created_at) = :year AND MONTH(created_at) = :month`;
      const resultQueryVapes = await sequelize.query(queryVenteVapes, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { year: currentYear, month: currentMonth },
      });
  
      const queryVenteDivers = `
        SELECT SUM(Total) AS totalDiversSales 
        FROM SalesDivers 
        WHERE YEAR(created_at) = :year AND MONTH(created_at) = :month`;
      const resultQueryDivers = await sequelize.query(queryVenteDivers, {
        type: sequelize.QueryTypes.SELECT,
        replacements: { year: currentYear, month: currentMonth },
      });
  
      const totalLiquideSales = resultQueryLiquide[0]?.totalLiquideSales || 0;
      const totalVapeSales = resultQueryVapes[0]?.totalVapeSales || 0;
      const totalDiversSales = resultQueryDivers[0]?.totalDiversSales || 0;
  
      res.send({
        totalLiquideSales,
        totalVapeSales,
        totalDiversSales,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error retrieving sales data for the month');
    }
  };
  
  const selectVenteParJour2 = async (req, res) => {
    try {
      const queryVenteLiquide = `SELECT SUM(TotalSales) AS totalLiquideSales FROM Sales WHERE DATE(created_at) = CURDATE()`;
      const resultQueryLiquide = await sequelize.query(queryVenteLiquide, {
        type: sequelize.QueryTypes.SELECT,
      });
  
      const queryVenteVapes = `SELECT SUM(PrixVente) AS totalVapeSales FROM SalesVapes WHERE DATE(created_at) = CURDATE()`;
      const resultQueryVapes = await sequelize.query(queryVenteVapes, {
        type: sequelize.QueryTypes.SELECT,
      });
  
      const queryVenteDivers = `SELECT SUM(Total) AS totalDiversSales FROM SalesDivers WHERE DATE(created_at) = CURDATE()`;
      const resultQueryDivers = await sequelize.query(queryVenteDivers, {
        type: sequelize.QueryTypes.SELECT,
      });
  
      const totalLiquideSales = resultQueryLiquide[0].totalLiquideSales || 0;
      const totalVapeSales = resultQueryVapes[0].totalVapeSales || 0;
      const totalDiversSales = resultQueryDivers[0].totalDiversSales || 0;
  
      res.send({
        totalLiquideSales,
        totalVapeSales,
        totalDiversSales,
      });
    } catch (err) {
      res.status(500).send('Error selecting');
    }
  };

module.exports={
    selectLiquide,
    selectVenteParJour,
    selectCreditParJour,
    selectFlaconEmpty,
    selectFlaconUsed,
    top5liquide,
    selectVenteParMois,
    selectVenteParJour2
}