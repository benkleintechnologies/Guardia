import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { List, ListItem, ListItemText, TextField, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface TeamSharingProps {
  currentTeamId: string;
}

interface SharedTeam {
  id: string;
  to: string;
}

const TeamSharing: React.FC<TeamSharingProps> = ({ currentTeamId }) => {
  const [sharedTeams, setSharedTeams] = useState<SharedTeam[]>([]);
  const [newTeamId, setNewTeamId] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'sharing'), where('from', '==', currentTeamId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sharedTeamsData = snapshot.docs.map(doc => ({
        id: doc.id,
        to: doc.data().to,
      }));
      setSharedTeams(sharedTeamsData);
    });

    return () => unsubscribe();
  }, [currentTeamId]);

  const handleAddTeam = async () => {
    if (newTeamId && newTeamId !== currentTeamId) {
      await addDoc(collection(db, 'sharing'), {
        from: currentTeamId,
        to: newTeamId,
      });
      setNewTeamId('');
    }
  };

  const handleRemoveTeam = async (shareId: string) => {
    await deleteDoc(doc(db, 'sharing', shareId));
  };

  return (
    <>
      <List>
        {sharedTeams.map((team) => (
          <ListItem key={team.id} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveTeam(team.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={`Shared with: ${team.to}`} />
          </ListItem>
        ))}
      </List>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        label="Team ID"
        value={newTeamId}
        onChange={(e) => setNewTeamId(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleAddTeam}
        sx={{ mt: 1 }}
      >
        Add Team
      </Button>
    </>
  );
};

export default TeamSharing;