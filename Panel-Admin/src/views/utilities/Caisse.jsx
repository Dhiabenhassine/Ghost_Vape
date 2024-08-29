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
    field: 'CaisseDebut',
    headerName: 'Fond De Caisse',
    width: 250,
    editable: true,
  },
  {
    field: 'CaisseFin',
    headerName: 'Caisse Fin de Jour',
    width: 200,
    editable: true,
  },
  {
    field: 'BeneficeCaisse',
    headerName: 'Total Vente',
    width: 200,
    editable: true,
  },
  {
    field: 'Ventesupposer',
    headerName: 'Vente suposer',
    width: 200,
    editable: true,
  },
  {
    field: 'Masrouf',
    headerName: 'Masrouf',
    width: 200,
    editable: true,
  },
  {
    field: 'Created_at',
    headerName: 'Date de Caisse',
    type: 'number',
    width: 200,
    editable: true,
  },
];

export default function Vente() {
  const [rows, setRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCaisse, setOpenModalCaisse] = useState(false);

  const [newCaisse, setNewCaisse] = useState({
    CaisseDebut: ''
  });
  const [newCaisseFin, setNewCaisseFin] = useState({
    ID_Caisee: '', CaisseFin: ''
  });
 

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/Caisse/selectCaisse');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_Caisse || `id-${index}`,
      }));
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCaisse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvanceInputChange = (e) => {
    const { name, value } = e.target;
    setNewCaisseFin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertCaisse = async () => {
    try {
      const { CaisseDebut } = newCaisse;
      await axios.post('http://127.0.0.1:4000/Caisse/insertCaisse', {
        CaisseDebut      });
      setOpenModal(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const updateCaisse = async () => {
    try {
      const { ID_Caisee, CaisseFin } = newCaisseFin;
      await axios.post('http://127.0.0.1:4000/Caisse/updateCaisse', {
        ID_Caisee, CaisseFin
      });
      setOpenModalCaisse(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleRowClick = (params) => {
    setNewCaisseFin({ ID_Caisee: params.row.ID_Caisee, CaisseFin: '' });
    setOpenModalCaisse(true);
  };

  return (
    <Box sx={{ height: 700, width: '90%',marginLeft:'5%', background: 'white', marginTop: '3%' }}>
      <Box>
        <AddIcon sx={{ cursor: 'pointer', marginLeft: '3%', marginTop: '2%' }} onClick={() => setOpenModal(true)} />
      </Box>
     
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle> Fond de Caisse</DialogTitle>
        <DialogContent>
          <TextField
            label="Fond de Caisse"
            name="CaisseDebut"
            value={newCaisse.Nom}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        
      
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button onClick={insertCaisse} variant="contained" color="primary">Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openModalCaisse} onClose={() => setOpenModalCaisse(false)}>
        <DialogTitle> Caisse Fin De Jour</DialogTitle>
        <DialogContent>
          <TextField
            label="ID Caisse"
            name="ID_Caisee"
            value={newCaisseFin.ID_Caisee}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 ,marginTop:'2%'}}
          />
          
          <TextField
            label="CaisseFin"
            name="CaisseFin"
            value={newCaisseFin.CaisseFin}
            onChange={handleAvanceInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
        
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModalCaisse(false)}>Cancel</Button>
          <Button onClick={updateCaisse} variant="contained" color="primary">Add</Button>
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
