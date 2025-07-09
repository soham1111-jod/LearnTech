import unittest
from app import create_app

class ProjectTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()

    def test_home(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, 200)
        self.assertIn('GENAI Backend is running', res.get_json().get('message', ''))

    def test_submit_project_missing_fields(self):
        res = self.client.post('/api/projects/submit', json={})
        self.assertEqual(res.status_code, 400)
        self.assertIn('error', res.get_json())

if __name__ == '__main__':
    unittest.main() 