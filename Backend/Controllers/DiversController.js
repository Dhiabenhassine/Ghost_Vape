const sequelize = require("../database");

const insertDivers = async (req, res) => {
    try {
        const { Article, PrixAchat, Qte } = req.body;

        // Query to check if there are existing entries
        const selectDivers = `SELECT * FROM Divers WHERE Article = :Article`;
        const resultSelect = await sequelize.query(selectDivers, {
            replacements: { Article },
            type: sequelize.QueryTypes.SELECT
        });

        if (resultSelect.length > 0) {
            // If entry exists, update the quantity and average the price
            const currentQte = parseFloat(resultSelect[0].Qte);
            const currentPrixAchat = parseFloat(resultSelect[0].PrixAchat);
            const newQte = currentQte + parseFloat(Qte);
            const newPrixAchat = ((currentPrixAchat * currentQte) + (parseFloat(PrixAchat) * parseFloat(Qte))) / newQte;
            const newPrixAchatFixed=newPrixAchat.toFixed(2)
            const updateDivers = `
                UPDATE Divers 
                SET Qte = :newQte, PrixAchat = :newPrixAchatFixed 
                WHERE Article = :Article
            `;

            await sequelize.query(updateDivers, {
                replacements: { Article, newPrixAchatFixed, newQte },
                type: sequelize.QueryTypes.UPDATE
            });

            res.status(200).json({ message: "Divers updated successfully" });
        } else {
            // If entry does not exist, insert new entry
            const insertDivers = `
                INSERT INTO Divers (Article, PrixAchat, Qte) 
                VALUES (:Article, :PrixAchat, :Qte)
            `;

            await sequelize.query(insertDivers, {
                replacements: { Article, PrixAchat: parseFloat(PrixAchat), Qte: parseFloat(Qte) },
                type: sequelize.QueryTypes.INSERT
            });

            res.status(200).json({ message: "Divers inserted successfully" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during insert');
    }
}



const selectAllDivers=async(req,res)=>{
    try{
const querySelect=`SELECT * FROM Divers`
const resultQueryDivers=await sequelize.query(querySelect,{
    type: sequelize.QueryTypes.SELECT
})
res.status(200).json(resultQueryDivers)
    }catch(err){
        res.status(500).send('err select')
    }
}
const venteDivers = async (req, res) => {
    try {
        const { ID_Divers, QteVendu, PrixVente } = req.body;

        // Calculate total vente
        const vente = QteVendu * PrixVente;

        // Query to get the current quantity and purchase price
        const selectQuery = `SELECT Qte, PrixAchat, Article FROM Divers WHERE ID_Divers = :ID_Divers`;
        const resultSelect = await sequelize.query(selectQuery, {
            replacements: { ID_Divers },
            type: sequelize.QueryTypes.SELECT
        });

        if (resultSelect.length > 0) {
            const currentQte = parseFloat(resultSelect[0].Qte);
            const prixAchat = parseFloat(resultSelect[0].PrixAchat);
            const article = resultSelect[0].Article;

            // Calculate new benefice
            const beneficeArticle = (PrixVente - prixAchat) * QteVendu;
            const QteAvendre = currentQte - QteVendu;

            // Insert into SalesDivers
            const insertQuery = 
                `INSERT INTO SalesDivers (Article, PrixAchat, QteVendu, PrixVente, Total, BeneficeArticle, created_at)
                 VALUES (:Article, :PrixAchat, :QteVendu, :PrixVente, :Total, :BeneficeArticle, NOW())`;
            await sequelize.query(insertQuery, {
                replacements: {
                    Article: article,
                    PrixAchat: prixAchat.toFixed(2),
                    QteVendu,
                    PrixVente: PrixVente,
                    Total: vente.toFixed(2),
                    BeneficeArticle: beneficeArticle.toFixed(2)
                },
                type: sequelize.QueryTypes.INSERT
            });

            // Update the Divers table with the new quantity
            const updateQuery = 
                `UPDATE Divers 
                 SET Qte = :QteAvendre
                 WHERE ID_Divers = :ID_Divers`;
            await sequelize.query(updateQuery, {
                replacements: {
                    QteAvendre: QteAvendre.toFixed(2),
                    ID_Divers
                },
                type: sequelize.QueryTypes.UPDATE
            });

            res.status(200).send('Vente updated');
        } else {
            res.status(404).send('Divers not found');
        }

    } catch (err) {
        console.error(err);
        res.status(500).send('Error during vente');
    }
};


const selectVenteDivers=async(req,res)=>{
    try{
const querySelect=`SELECT * FROM SalesDivers`
const result=await sequelize.query(querySelect,{type:sequelize.QueryTypes.SELECT})
res.status(200).send(result)
    }catch(err){
        res.status(500).send('err select')
    }
}


module.exports={
    insertDivers,
    selectAllDivers,
    venteDivers,
    selectVenteDivers
}