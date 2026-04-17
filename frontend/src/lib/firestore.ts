import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';

export interface User {
  uid: string;
  displayName: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Snippet {
  id?: string;
  title: string;
  code: string;
  language: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createUser = async (
  userData: Omit<User, "createdAt" | "updatedAt">
): Promise<void> => {
  try {
    const userDoc = {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", userData.uid), userDoc);
    console.log("✅ User created in Firestore");
  } catch (error) {
    console.error("🔥 Error creating user:", error);
    throw error;
  }
};

export const getUserById = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (userDoc.exists()) {
      return {
        uid: userDoc.id,
        ...userDoc.data()
      } as User;
    } else {
      console.log('No user found with ID:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const createSnippet = async (
  userId: string,
  title: string, 
  code: string, 
  language: string
): Promise<string> => {
  try {
    const snippetData = {
      title,
      code,
      language,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const snippetsRef = collection(db, 'users', userId, 'snippets');
    const docRef = await addDoc(snippetsRef, snippetData);
    
    console.log('✅ Snippet created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('🔥 Error creating snippet:', error);
    throw error;
  }
};

export const getUserSnippets = async (userId: string): Promise<Snippet[]> => {
  try {
    const q = query(
      collection(db, 'users', userId, 'snippets'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const snippets: Snippet[] = [];
    
    querySnapshot.forEach((docSnap) => {
      snippets.push({
        id: docSnap.id,
        ...docSnap.data()
      } as Snippet);
    });
    
    return snippets;
  } catch (error) {
    console.error('🔥 Error getting user snippets:', error);
    throw error;
  }
};

export const updateSnippet = async (
  userId: string,
  snippetId: string, 
  updates: Partial<Snippet>
): Promise<void> => {
  try {
    const snippetRef = doc(db, 'users', userId, 'snippets', snippetId);
    await updateDoc(snippetRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Snippet updated successfully');
  } catch (error) {
    console.error('🔥 Error updating snippet:', error);
    throw error;
  }
};

export const deleteSnippet = async (userId: string, snippetId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'users', userId, 'snippets', snippetId));
    console.log('✅ Snippet deleted successfully');
  } catch (error) {
    console.error('🔥 Error deleting snippet:', error);
    throw error;
  }
};
