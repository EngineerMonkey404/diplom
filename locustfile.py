from locust import HttpUser, task

class HelloWorldUser(HttpUser):
    @task
    def hello_world(self):
        self.client.get("api/models?search=model&page=1")
        self.client.get("api/models/1")