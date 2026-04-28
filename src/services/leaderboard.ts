export interface LeaderboardEntry {
    id: string;
    displayName: string;
    total_score: number;
}

export const getTopStaffMembers = async (): Promise<LeaderboardEntry[]> => {
    return [
        { id: '1', displayName: 'Sarah Jenkins (General Manager)', total_score: 1250 },
        { id: '2', displayName: 'Mike Chen (Security)', total_score: 950 },
        { id: '3', displayName: 'Amanda Torres (Kitchen)', total_score: 800 },
        { id: '4', displayName: 'Marcus Johnson (Front Desk)', total_score: 750 },
        { id: '5', displayName: 'Elena Rostova (Housekeeping)', total_score: 600 }
    ];
};
