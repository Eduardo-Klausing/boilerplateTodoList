import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { TarefasCollection } from '/imports/api/tarefas';

interface Tarefa {
  _id: string;
  descricao: string;
  situacao: 'Não concluída' | 'Concluída';
  dataAtualizacao: Date;
  userId: string;
}

const ToDoList: React.FC = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Tarefa | null>(null);
  const [formData, setFormData] = useState({
    descricao: '',
    situacao: 'Não concluída' as 'Não concluída' | 'Concluída',
  });

  const { tarefas, usuarios, isLoading } = useTracker(() => {
    const tarefasSub = Meteor.subscribe('tarefas.usuario');
    const usersSub = Meteor.subscribe('users.usernames');

    const tarefas = TarefasCollection.find({}, { sort: { dataAtualizacao: -1 } }).fetch();
    const usuarios = Meteor.users.find({}, { fields: { username: 1 } }).fetch();

    return {
      tarefas,
      usuarios,
      isLoading: !tarefasSub.ready() || !usersSub.ready(),
    };
  }, []);

  const handleOpenDialog = (task?: Tarefa) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        descricao: task.descricao || '',
        situacao: task.situacao
      });
    } else {
      setEditingTask(null);
      setFormData({
        descricao: '',
        situacao: 'Não concluída'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
    setFormData({
      descricao: '',
      situacao: 'Não concluída'
    });
  };

  const handleSubmit = () => {
    if (editingTask) {
      Meteor.call('tarefas.atualizar', editingTask._id, formData, (error: Meteor.Error | undefined) => {
        if (error) {
          alert('Erro ao atualizar tarefa: ' + error.message);
        } else {
          handleCloseDialog();
        }
      });
    } else {
      Meteor.call('tarefas.inserir', formData, (error: Meteor.Error | undefined) => {
        if (error) {
          alert('Erro ao criar tarefa: ' + error.message);
        } else {
          handleCloseDialog();
        }
      });
    }
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      Meteor.call('tarefas.remover', taskId, (error: Meteor.Error | undefined) => {
        if (error) {
          alert('Erro ao excluir tarefa: ' + error.message);
        }
      });
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const getUsernameById = (userId: string) => {
    const user = usuarios.find(u => u._id === userId);
    return user?.username || 'Desconhecido';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackToHome} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Minhas Tarefas</Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Lista de Tarefas
        </Typography>

        {isLoading ? (
          <Typography variant="body1">Carregando tarefas...</Typography>
        ) : tarefas.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Nenhuma tarefa encontrada. Clique no botão "+" para adicionar.
          </Typography>
        ) : (
          <List>
            {tarefas.map((tarefa) => (
              <ListItem
                key={tarefa._id}
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  backgroundColor: '#fafafa',
                  minWidth: '400px'
                }}
              >
                <IconButton
                  onClick={() => {
                    const novaSituacao = tarefa.situacao === 'Concluída' ? 'Não concluída' : 'Concluída';
                    Meteor.call('tarefas.atualizar', tarefa._id, {
                      descricao: tarefa.descricao,
                      situacao: novaSituacao
                    }, (error: Meteor.Error | undefined) => {
                      if (error) {
                        alert('Erro ao atualizar situação: ' + error.message);
                      }
                    });
                  }}
                  sx={{
                    border: '2px solid #888',
                    mr: 2,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                  }}
                >
                  {tarefa.situacao === 'Concluída' && (
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>✓</Typography>
                  )}
                </IconButton>

                <ListItemText
                  primary={
                    <Typography sx={{
                      textDecoration: tarefa.situacao === 'Concluída' ? 'line-through' : 'none',
                    }}>
                      {tarefa.descricao}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Criado por: {tarefa.userId === Meteor.userId() ? 'Você' : getUsernameById(tarefa.userId)}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  {tarefa.userId === Meteor.userId() && (
                    <>
                      <IconButton edge="end" onClick={() => handleOpenDialog(tarefa)} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleDelete(tarefa._id)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenDialog()}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  label="Descrição"
                  fullWidth
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTask ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ToDoList;
