import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import HomeStyles from './homeStyle';
import { TarefasCollection } from '/imports/api/tarefas'; 


const Home: React.FC = () => {
  const { Container, Header } = HomeStyles;
  const navigate = useNavigate();
  
const { tarefasRecentes, isLoading } = useTracker(() => {
  const subscription = Meteor.subscribe('tarefas.recentes', 5);
  const tarefas = TarefasCollection
    .find({}, { sort: { dataAtualizacao: -1 }, limit: 5 })
    .fetch();

  return {
    tarefasRecentes: tarefas,
    isLoading: !subscription.ready(),
  };
}, []);


  const getSituacaoColor = (situacao: string) => {
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

  const handleNavigateToTodoList = () => {
    navigate('/todos');
  };

  return (
    <Container>
      <Header>
        <Typography variant="h3" gutterBottom>
          Bem-vindo ao Sistema
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Atividades Recentes
          </Typography>
          
          {isLoading ? (
            <Typography variant="body1">Carregando atividades...</Typography>
          ) : tarefasRecentes.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              Nenhuma atividade encontrada.
            </Typography>
          ) : (
            <List>
              {tarefasRecentes.map((tarefa) => (
                <ListItem
                  key={tarefa._id}
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    mb: 1,
                    backgroundColor: '#fafafa',
                    minWidth: '340px'
                  }}
                >
                  <ListItemText
                    primary={tarefa.descricao}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                          label={getSituacaoLabel(tarefa.situacao)}
                          color={getSituacaoColor(tarefa.situacao)}
                          size="small"
                        />
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleNavigateToTodoList}
            sx={{ px: 4, py: 2 }}
          >
            Minhas Tarefas
          </Button>
        </Box>
      </Header>
    </Container>
  );
};

export default Home;