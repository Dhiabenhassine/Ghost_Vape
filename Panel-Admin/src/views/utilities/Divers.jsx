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

const columns = [
  {
    field: 'Article',
    headerName: 'Article',
    width: 190,
    editable: true,
  },
  {
    field: 'PrixAchat',
    headerName: 'Prix Achat',
    width: 150,
    editable: true,
  },{
    field: 'Qte',
    headerName: 'Qte',
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
  }, {
    field: 'QteVendu',
    headerName: 'Qte Vendu',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'Total',
    headerName: 'Total',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'BeneficeArticle',
    headerName: 'Benefice Article',
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
  const [openModalDivers, setOpenModalDivers] = useState(false);

  const [newDivers, setNewDivers] = useState({
    Article: '',
    PrixAchat: '',
    Qte: '',
  });
  
  const [venteNewDivers, setVenteNewDivers] = useState({
    ID_Divers: '',
    QteVendu: '',
    PrixVente: '',
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/Divers/selectAllDivers');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_Divers || `id-${index}`,
      }));
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDiversInputChange = (e) => {
    const { name, value } = e.target;
    setVenteNewDivers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDivers((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertDivers = async () => {
    try {
      const { Article, PrixAchat, Qte } = newDivers;
      await axios.post('http://127.0.0.1:4000/Divers/insertDivers', {
        Article,
        PrixAchat,
        Qte,
      });
      setOpenModal(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const venteDivers = async () => {
    try {
      const { ID_Divers, QteVendu, PrixVente } = venteNewDivers;
      await axios.post('http://127.0.0.1:4000/Divers/venteDivers', {
        ID_Divers,
        QteVendu,
        PrixVente,
      });
      setOpenModalDivers(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRowClick = (params) => {
    setVenteNewDivers({
      ID_Divers: params.row.ID_Divers,
      QteVendu: '',
      PrixVente: '',
    });
    setOpenModalDivers(true);
  };

  return (
    <Box sx={{ height: 700, width: '90%', marginLeft: '5%', background: 'white', marginTop: '3%' }}>
      <Box>
        <AddIcon sx={{ cursor: 'pointer', marginLeft: '3%', marginTop: '2%' }} onClick={() => setOpenModal(true)} />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Divers</DialogTitle>
        <DialogContent>
          <TextField
            label="Article"
            name="Article"
            value={newDivers.Article}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Prix Achat"
            name="PrixAchat"
            value={newDivers.PrixAchat}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Qte"
            name="Qte"
            value={newDivers.Qte}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={insertDivers} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openModalDivers} onClose={() => setOpenModalDivers(false)}>
        <DialogTitle>Insert Divers</DialogTitle>
        <DialogContent>
          <TextField
            label="ID_Divers"
            name="ID_Divers"
            value={venteNewDivers.ID_Divers}
            variant="outlined"
            fullWidth
            disabled
            sx={{ mb: 1 }}
          />
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
          <Button onClick={() => setOpenModalDivers(false)}>Cancel</Button>
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
        onRowClick={handleRowClick}
        sx={{ marginTop: '2%' }}
      />
    </Box>
  );
}