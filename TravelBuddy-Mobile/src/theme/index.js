export const colors = {
  primary: '#FF385C', 
  primaryDark: '#D91738',
  secondary: '#00A699', 
  background: '#FFFFFF',
  surface: '#F7F7F7',
  text: '#222222',
  textLight: '#717171',
  border: '#EBEBEB',
  error: '#C13515',
  success: '#008A05',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  header: { fontSize: 28, fontWeight: '700', color: colors.text },
  title: { fontSize: 20, fontWeight: '600', color: colors.text },
  body: { fontSize: 16, fontWeight: '400', color: colors.text },
  caption: { fontSize: 14, fontWeight: '400', color: colors.textLight },
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
};
