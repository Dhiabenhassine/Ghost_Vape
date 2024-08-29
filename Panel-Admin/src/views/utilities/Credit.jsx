import * as React from 'react';
import { useState, useEffect } from 'react';
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
  {
    field: 'Nom',
    headerName: 'Nom & Prenom',
    width: 250,
    editable: true,
  },
  {
    field: 'ArticleVendu',
    headerName: 'Article Vendu',
    width: 200,
    editable: true,
  },
  {
    field: 'Qte',
    headerName: 'Qte',
    width: 200,
    editable: true,
  },
  {
    field: 'PrixAchat',
    headerName: 'Prix Achat',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'PrixVente',
    headerName: 'Prix Vente',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'Credit',
    headerName: 'Rest',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'Avance',
    headerName: 'Avance',
    type: 'number',
    width: 150,
    editable: true,
  }, {
    field: 'Benefice',
    headerName: 'Benefice',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'created_at',
    headerName: 'Date de Vente',
    type: 'number',
    width: 200,
    editable: true,
  },
];

export default function Vente() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAvance, setOpenModalAvance] = useState(false);

  const [newCredit, setNewCredit] = useState({
    Nom: '', ArticleVendu: '', Qte: '', Avance: '', PrixVente: '', PrixAchat: ''
  });
  const [newAvance, setNewAvance] = useState({
    ID_Credit: '', Avance: ''
  });
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/Credit/selectAllCredit');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_Credit || `id-${index}`,
      }));
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchArticles = async (category) => {
    try {
      let response;
      switch (category) {
        case 'Divers':
          response = await axios.get('http://127.0.0.1:4000/Divers/selectAllDivers');
          setArticles(response.data.map(item => ({ label: item.Article, value: item.Article })));
          break;
        case 'Vapes':
          response = await axios.get('http://127.0.0.1:4000/VapeController/selectAllVapes');
          setArticles(response.data.map(item => ({ label: item.NomVape, value: item.NomVape })));
          break;
        case 'Liquides':
          response = await axios.get('http://127.0.0.1:4000/StockController/selectAllLiquide');
          setArticles(response.data.map(item => ({ label: item.NomLiquide, value: item.NomLiquide })));
          break;
        default:
          setArticles([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setCategory(value);
    fetchArticles(value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCredit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvanceInputChange = (e) => {
    const { name, value } = e.target;
    setNewAvance((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertFlacon = async () => {
    try {
      const { Nom, ArticleVendu, Qte, Avance, PrixVente, PrixAchat } = newCredit;
      await axios.post('http://127.0.0.1:4000/Credit/insertCredit', {
        Nom, ArticleVendu, Qte, Avance, PrixVente, PrixAchat
      });
      setOpenModal(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const insertAvance = async () => {
    try {
      const { ID_Credit, Avance } = newAvance;
      await axios.post('http://127.0.0.1:4000/Credit/insertAvance', {
        ID_Credit, Avance
      });
      setOpenModalAvance(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRowClick = (params) => {
    setNewAvance({ ID_Credit: params.row.ID_Credit, Avance: '' });
    setOpenModalAvance(true);
  };

  return (
    <Box sx={{ height: 700, width: '100%', background: 'white', marginTop: '3%' }}>
      <Box>
        <AddIcon sx={{ cursor: 'pointer', marginLeft: '3%', marginTop: '2%' }} onClick={() => setOpenModal(true)} />
      </Box>
     
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Credit</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom & Prenom"
            name="Nom"
            value={newCredit.Nom}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
            <InputLabel>Category</InputLabel>
            <Select
              label="Category"
              value={category}
              onChange={handleCategoryChange}
            >
              <MenuItem value="Divers">Divers</MenuItem>
              <MenuItem value="Vapes">Vapes</MenuItem>
              <MenuItem value="Liquides">Liquides</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ mb: 1 }}>
            <InputLabel>Article Vendu</InputLabel>
            <Select
              label="Article Vendu"
              name="ArticleVendu"
              value={newCredit.ArticleVendu}
              onChange={handleInputChange}
            >
              {articles.map((article, index) => (
                <MenuItem key={index} value={article.value}>{article.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Qte"
            name="Qte"
            value={newCredit.Qte}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Avance"
            name="Avance"
            value={newCredit.Avance}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Prix Achat"
            name="PrixAchat"
            value={newCredit.PrixAchat}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Prix Vente"
            name="PrixVente"
            value={newCredit.PrixVente}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={insertFlacon} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openModalAvance} onClose={() => setOpenModalAvance(false)}>
        <DialogTitle>Insert Avance</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Credit"
            name="ID_Credit"
            value={newAvance.ID_Credit}
           // onChange={handleAvanceInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Avance"
            name="Avance"
            value={newAvance.Avance}
            onChange={handleAvanceInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalAvance(false)}>Cancel</Button>
          <Button onClick={insertAvance} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        onRowClick={handleRowClick}
        sx={{ marginTop: '2%' }}
      />
    </Box>
  );
}
