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
    field: 'nbrFlaconEmpty',
    headerName: 'nbr Flacon Vide',
    width: 150,
    editable: true,
  },
  {
    field: 'PriceFlacon',
    headerName: 'Prix Flacon',
    width: 120,
    editable: true,
  },
  {
    field: 'PriceUnitFlacon',
    headerName: 'Prix Unitaire Flacon',
    type: 'number',
    width: 120,
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
  const [newFlacon, setNewFlacon] = useState({
    nbrFlaconEmpty: '',
    PriceUnitFlacon: '',
  });
  const [totalNbrFlaconEmpty, setTotalNbrFlaconEmpty] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:4000/StockFlacon/selectAllFlacon');
      const data = response.data.map((row, index) => ({
        ...row,
        id: row.ID_StockFlacon || `id-${index}`,
      }));
      setRows(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const total = rows.reduce((sum, row) => sum + Number(row.nbrFlaconEmpty || 0), 0);
    setTotalNbrFlaconEmpty(total);
  }, [rows]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFlacon((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertFlacon = async () => {
    try {
      const { nbrFlaconEmpty, PriceUnitFlacon } = newFlacon;
      await axios.post('http://127.0.0.1:4000/StockFlacon/insertFlacon', {
        nbrFlaconEmpty,
        PriceUnitFlacon,
      });
      setOpenModal(false);
      fetchData();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ height: 400, width: '45%', marginLeft: '25%', background: 'white', marginTop: '3%' }}>
      <Box>
        <AddIcon sx={{ cursor: 'pointer' ,marginLeft:'3%',marginTop:'2%'}} onClick={() => setOpenModal(true)} />
      </Box>
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Flacon</DialogTitle>
        <DialogContent>
          <TextField
            label="nbr Flacon Vide"
            name="nbrFlaconEmpty"
            value={newFlacon.nbrFlaconEmpty}
            onChange={handleInputChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Prix Unitaire Flacon"
            name="PriceUnitFlacon"
            value={newFlacon.PriceUnitFlacon}
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
      <Box sx={{ marginTop: '2%', textAlign: 'right', paddingRight: '10%' }}>
        <strong>Total nbr Flacon Vide: {totalNbrFlaconEmpty}</strong>
      </Box>
    </Box>
  );
}
