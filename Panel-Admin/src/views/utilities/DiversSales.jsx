import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
const columns = [
  { field: 'Article', headerName: 'Article', width: 190, editable: true },
  { field: 'PrixAchat', headerName: 'Prix Achat', width: 150, editable: true },
  { field: 'PrixVente', headerName: 'Prix Vente', type: 'number', width: 150, editable: true },
  { field: 'QteVendu', headerName: 'Qte Vendu', type: 'number', width: 150, editable: true },
  { field: 'Total', headerName: 'Total', type: 'number', width: 150, editable: true },
  { field: 'BeneficeArticle', headerName: 'Benefice Article', type: 'number', width: 150, editable: true },
  { field: 'created_at', headerName: 'Date de Vente', width: 200, editable: true },
];

export default function Vente() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [articles, setArticles] = useState([]);
  const [venteNewDivers, setVenteNewDivers] = useState({
    ID_Divers: '',
    Article: '',
    QteVendu: '',
    PrixVente: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/Divers/selectVenteDivers');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_Divers || `id-${index}`,
      }));
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/Divers/selectAllDivers');
      setArticles(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchArticles();
  }, []);

  const handleDiversInputChange = (e) => {
    const { name, value } = e.target;
    setVenteNewDivers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const venteDivers = async () => {
    try {
      const { ID_Divers, QteVendu, PrixVente } = venteNewDivers;
      await axios.post('http://127.0.0.1:4000/Divers/venteDivers', {
        ID_Divers,
        QteVendu,
        PrixVente,
      });
      setOpenModal(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddClick = () => {
    setVenteNewDivers({
      ID_Divers: '',
      Article: '',
      QteVendu: '',
      PrixVente: '',
    });
    setOpenModal(true);
  };

  return (
    <Box sx={{ height: 700, width: '80%', marginLeft: '10%', background: 'white', marginTop: '3%' }}>
      <Box>
        <AddIcon sx={{ cursor: 'pointer', marginLeft: '3%', marginTop: '2%' }} onClick={handleAddClick} />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Vente Divers</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Article</InputLabel>
            <Select
              label="Article"
              name="ID_Divers"
              value={venteNewDivers.ID_Divers}
              onChange={handleDiversInputChange}
            >
              {articles.map((article) => (
                <MenuItem key={article.ID_Divers} value={article.ID_Divers}>
                  {article.Article}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Qte Vendu"
            name="QteVendu"
            value={venteNewDivers.QteVendu}
            onChange={handleDiversInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Prix Vente"
            name="PrixVente"
            value={venteNewDivers.PrixVente}
            onChange={handleDiversInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={venteDivers} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{ marginTop: '2%' }}
      />
    </Box>
  );
}
