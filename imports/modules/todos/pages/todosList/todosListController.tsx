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
  Chip,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  titulo: string;
  descricao?: string;
  situacao: 'pendente' | 'em-andamento' | 'concluida';
  dataCriacao?: Date;
  dataAtualizacao: Date;
  userId: string;
}

const ToDoList: React.FC = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Tarefa | null>(null);
  const [formData, setFormData] = useState<{
    titulo: string;
    descricao: string;
    situacao: 'pendente' | 'em-andamento' | 'concluida';
  }>({
    titulo: '',
    descricao: '',
    situacao: 'pendente'
  });

  // Subscription para as tarefas do usuário
  const { tarefas, isLoading } = useTracker(() => {
  const userId = Meteor.userId();
  if (!userId) {
   // Se chegou aqui, não há usuário logado — você pode redirecionar ou retornar lista vazia
  }
  const subscription = Meteor.subscribe('tarefas.usuario');
  const tasks = TarefasCollection
   .find({ userId: userId! }, { sort: { dataAtualizacao: -1 } })
   .fetch();
    return {
      tarefas: tasks,
      isLoading: !subscription.ready()
    };
  }, []);

  const handleOpenDialog = (task?: Tarefa) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        titulo: task.titulo,
        descricao: task.descricao || '',
        situacao: task.situacao
      });
    } else {
      setEditingTask(null);
      setFormData({
        titulo: '',
        descricao: '',
        situacao: 'pendente'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
    setFormData({
      titulo: '',
      descricao: '',
      situacao: 'pendente'
    });
  };

  const handleSubmit = () => {
    if (!formData.titulo.trim()) {
      alert('Por favor, insira um título para a tarefa.');
      return;
    }

    if (editingTask) {
      // Atualizar tarefa existente
      Meteor.call('tarefas.atualizar', editingTask._id, formData, (error: Meteor.Error | undefined) => {
        if (error) {
          alert('Erro ao atualizar tarefa: ' + error.message);
        } else {
          handleCloseDialog();
        }
      });
    } else {
      // Criar nova tarefa
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

  const getSituacaoColor = (situacao: string): 'warning' | 'info' | 'success' | 'default' => {
    switch (situacao) {
      case 'pendente':
        return 'warning';
      case 'em-andamento':
        return 'info';
      case 'concluida':
        return 'success';
      default:
        return 'default';
    }
  };

  const getSituacaoLabel = (situacao: string) => {
    switch (situacao) {
      case 'pendente':
        return 'Pendente';
      case 'em-andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      default:
        return situacao;
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBackToHome} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Minhas Tarefas
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Lista de Tarefas
        </Typography>
        
        {isLoading ? (
          <Typography variant="body1">Carregando tarefas...</Typography>
        ) : tarefas.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            Nenhuma tarefa encontrada. Clique no botão "+" para adicionar uma nova tarefa.
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
                  backgroundColor: '#fafafa'
                }}
              >
                <ListItemText
                  primary={tarefa.titulo}
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {tarefa.descricao || 'Sem descrição'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                          label={getSituacaoLabel(tarefa.situacao)}
                          color={getSituacaoColor(tarefa.situacao)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          Atualizado em: {new Date(tarefa.dataAtualizacao).toLocaleString('pt-BR')}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleOpenDialog(tarefa)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(tarefa._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Botão flutuante para adicionar nova tarefa */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenDialog()}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* Dialog para criar ou editar tarefa */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  label="Título"
                  fullWidth
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Descrição"
                  fullWidth
                  multiline
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Situação</InputLabel>
                  <Select
                    value={formData.situacao}
                    label="Situação"
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      situacao: e.target.value as 'pendente' | 'em-andamento' | 'concluida'
                    })}
                  >
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="em-andamento">Em Andamento</MenuItem>
                    <MenuItem value="concluida">Concluída</MenuItem>
                  </Select>
                </FormControl>
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